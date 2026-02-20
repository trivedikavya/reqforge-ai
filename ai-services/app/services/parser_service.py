"""
Enhanced parser service using utility functions
"""

import json
from typing import List, Dict, Any
from pathlib import Path
from app.utils.helpers import (
    load_json_file,
    extract_requirements_from_text,
    extract_stakeholders,
    chunk_text
)


class ParserService:
    """Service for parsing various document formats"""
    
    def parse_emails(self, file_path: str) -> List[Dict[str, Any]]:
        """
        Parse email data from JSON file
        
        Args:
            file_path: Path to email JSON file
            
        Returns:
            List of parsed email dictionaries
        """
        try:
            data = load_json_file(file_path)
            
            if isinstance(data, list):
                emails = data
            elif isinstance(data, dict):
                emails = [data]
            else:
                print(f"⚠️  Unexpected email data format in {file_path}")
                return []
            
            # Enrich emails with extracted requirements
            for email in emails:
                body = email.get('body', '')
                email['extracted_requirements'] = extract_requirements_from_text(body)
                email['mentioned_stakeholders'] = extract_stakeholders(body)
            
            print(f"✅ Parsed {len(emails)} emails from {file_path}")
            return emails
            
        except Exception as e:
            print(f"❌ Email parsing error for {file_path}: {str(e)}")
            return []
    
    def parse_meetings(self, file_path: str) -> List[Dict[str, Any]]:
        """
        Parse meeting transcript data from JSON file
        
        Args:
            file_path: Path to meeting JSON file
            
        Returns:
            List of parsed meeting dictionaries
        """
        try:
            data = load_json_file(file_path)
            
            if isinstance(data, list):
                meetings = data
            elif isinstance(data, dict):
                meetings = [data]
            else:
                print(f"⚠️  Unexpected meeting data format in {file_path}")
                return []
            
            # Enrich meetings with extracted information
            for meeting in meetings:
                transcript = meeting.get('transcript', '')
                
                # Extract requirements and decisions
                meeting['extracted_requirements'] = extract_requirements_from_text(transcript)
                meeting['mentioned_stakeholders'] = extract_stakeholders(transcript)
                
                # Chunk long transcripts
                if len(transcript) > 2000:
                    meeting['transcript_chunks'] = chunk_text(transcript, chunk_size=1000)
            
            print(f"✅ Parsed {len(meetings)} meetings from {file_path}")
            return meetings
            
        except Exception as e:
            print(f"❌ Meeting parsing error for {file_path}: {str(e)}")
            return []
    
    def parse_slack(self, file_path: str) -> List[Dict[str, Any]]:
        """
        Parse Slack message data from JSON file
        
        Args:
            file_path: Path to Slack JSON file
            
        Returns:
            List of parsed Slack message dictionaries
        """
        try:
            data = load_json_file(file_path)
            
            if isinstance(data, list):
                messages = data
            elif isinstance(data, dict):
                messages = [data]
            else:
                print(f"⚠️  Unexpected Slack data format in {file_path}")
                return []
            
            # Group messages by conversation threads
            threads = {}
            for msg in messages:
                channel = msg.get('channel', 'general')
                if channel not in threads:
                    threads[channel] = []
                threads[channel].append(msg)
            
            # Add thread context to each message
            for msg in messages:
                channel = msg.get('channel', 'general')
                msg['thread_context'] = {
                    'channel': channel,
                    'total_messages_in_channel': len(threads[channel])
                }
            
            print(f"✅ Parsed {len(messages)} Slack messages from {file_path}")
            return messages
            
        except Exception as e:
            print(f"❌ Slack parsing error for {file_path}: {str(e)}")
            return []
    
    def parse_text_file(self, file_path: str) -> Dict[str, Any]:
        """
        Parse plain text file
        
        Args:
            file_path: Path to text file
            
        Returns:
            Dictionary with parsed content
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            return {
                'filename': Path(file_path).name,
                'content': content,
                'extracted_requirements': extract_requirements_from_text(content),
                'mentioned_stakeholders': extract_stakeholders(content),
                'chunks': chunk_text(content) if len(content) > 2000 else [content]
            }
            
        except Exception as e:
            print(f"❌ Text file parsing error for {file_path}: {str(e)}")
            return {}
    
    def parse_all_sources(self, data_sources: Dict[str, str]) -> Dict[str, List[Dict]]:
        """
        Parse all data sources at once
        
        Args:
            data_sources: Dictionary with file paths for each source type
            
        Returns:
            Dictionary with parsed data for all sources
        """
        parsed_data = {
            'emails': [],
            'meetings': [],
            'slack': [],
            'documents': []
        }
        
        if 'emails' in data_sources:
            parsed_data['emails'] = self.parse_emails(data_sources['emails'])
        
        if 'meetings' in data_sources:
            parsed_data['meetings'] = self.parse_meetings(data_sources['meetings'])
        
        if 'slack' in data_sources:
            parsed_data['slack'] = self.parse_slack(data_sources['slack'])
        
        if 'documents' in data_sources:
            for doc_path in data_sources['documents']:
                if doc_path.endswith('.txt'):
                    parsed_data['documents'].append(self.parse_text_file(doc_path))
        
        return parsed_data


# Singleton instance
parser_service = ParserService()