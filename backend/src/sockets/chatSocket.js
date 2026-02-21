const ChatMessage = require('../models/ChatMessage.model');
const BRD = require('../models/BRD.model');
const aiService = require('../services/aiService');
const scraperService = require('../services/scraper.service');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    // Join room for specific project updates
    socket.on('join-project', (projectId) => {
      socket.join(projectId);
      console.log(`Socket ${socket.id} joined project ${projectId}`);
    });

    socket.on('leave-project', (projectId) => {
      socket.leave(projectId);
      console.log(`Socket ${socket.id} left project ${projectId}`);
    });

    // Main chat message handler
    socket.on('chat-message', async (data) => {
      try {
        const { projectId, message } = data;
        let aiInputMessage = message;
        let contextAddition = '';

        // 0. Intercept Web Scraping specific commands
        if (message.toLowerCase().startsWith('scrape ') || message.toLowerCase().startsWith('/scrape ')) {
          const urlToScrape = message.split(' ')[1];
          if (urlToScrape) {
            // Notify the frontend we're scraping
            socket.emit('ai-response', {
              message: `Intercepted scrape request... extracting content from ${urlToScrape}. Please hold.`,
              suggestions: []
            });

            try {
              const scrapedContent = await scraperService.scrapeUrl(urlToScrape);
              contextAddition = `\n\n[SYSTEM CONTEXT INJECTED FROM SCRAPED URL ${urlToScrape}]:\n${scrapedContent}\n\n[USER INSTRUCTION]: Integrate relevant information from the above scraped context into the BRD. Give me a summary of what you found.`;
              aiInputMessage = message + contextAddition;
            } catch (scrapeErr) {
              socket.emit('ai-response', {
                message: `Error scraping URL: ${scrapeErr.message}. I will proceed without this context.`,
                suggestions: []
              });
            }
          }
        }


        // 1. Persist the user's message in MongoDB
        await ChatMessage.create({
          projectId,
          role: 'user',
          content: message
        });

        // 2. Fetch AI response directly via Node, including potential scraped context
        const aiResponse = await aiService.chatWithAI(projectId, aiInputMessage);

        // 3. Persist the assistant's response in MongoDB
        await ChatMessage.create({
          projectId,
          role: 'assistant',
          content: aiResponse.message,
          suggestions: aiResponse.suggestions || []
        });

        // 4. Update the BRD document if changes were generated
        if (aiResponse.brdUpdate) {
          const updatedBrd = await BRD.findOneAndUpdate(
            { projectId },
            {
              content: aiResponse.brdUpdate,
              updatedAt: Date.now()
            },
            { new: true, upsert: true }
          );

          // Emit 'brd-updated' with the 'brd' key as expected by ProjectWorkspace.jsx
          io.to(projectId).emit('brd-updated', { brd: updatedBrd });
        }

        // 5. Respond back to the sender
        socket.emit('ai-response', {
          message: aiResponse.message,
          suggestions: aiResponse.suggestions || [],
          brdUpdate: aiResponse.brdUpdate
        });

      } catch (error) {
        console.error('Socket Chat Error:', error);
        socket.emit('error', { message: 'Failed to process AI request' });
      }
    });

    // Logic for applying AI suggestions
    socket.on('accept-suggestion', async (data) => {
      try {
        const { projectId, suggestion } = data;

        const result = await aiService.chatWithAI(
          projectId,
          `Please update the BRD with this suggestion: ${suggestion.text || suggestion}`
        );

        if (result.brdUpdate) {
          const updatedBrd = await BRD.findOneAndUpdate(
            { projectId },
            {
              content: result.brdUpdate,
              updatedAt: Date.now()
            },
            { new: true, upsert: true }
          );

          // Update the UI preview instantly
          io.to(projectId).emit('brd-updated', { brd: updatedBrd });

          socket.emit('ai-response', {
            message: `Suggestion applied: "${suggestion.text || suggestion}"`,
            suggestions: []
          });
        }
      } catch (error) {
        console.error('Suggestion Error:', error);
        socket.emit('error', { message: 'Failed to apply suggestion' });
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });
};