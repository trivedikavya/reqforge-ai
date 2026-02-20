#!/usr/bin/env python3
"""
Preprocess demo data from various sources
This script processes Enron emails, AMI transcripts, etc.
"""

import json
import os
import sys
from pathlib import Path

def create_directory_structure():
    """Create necessary directories"""
    dirs = [
        '../demo-data/processed',
        '../demo-data/sample-uploads',
        '../demo-data/raw'
    ]
    
    for dir_path in dirs:
        Path(dir_path).mkdir(parents=True, exist_ok=True)
        print(f"✅ Created directory: {dir_path}")

def generate_sample_project_emails():
    """Generate sample project-related emails"""
    emails = [
        {
            "from": "john.doe@company.com",
            "to": "sarah.smith@company.com",
            "cc": "team@company.com",
            "date": "2024-01-15T09:30:00Z",
            "subject": "RE: Mobile App Project Requirements",
            "body": """Hi Sarah,

Following up on our discussion yesterday about the mobile app requirements. Here are the key points we need to finalize:

1. User Authentication - OAuth 2.0 integration required
2. Push Notifications - Real-time alerts for order updates
3. Offline Mode - Users should be able to browse products offline
4. Payment Gateway - Stripe integration preferred
5. Timeline - We need to launch by Q2 2024

The budget has been approved for $150K. Let me know if you need any clarification.

Best regards,
John"""
        },
        {
            "from": "sarah.smith@company.com",
            "to": "john.doe@company.com",
            "date": "2024-01-15T14:20:00Z",
            "subject": "RE: Mobile App Project Requirements",
            "body": """John,

Thanks for the summary. I have a few concerns about the timeline:

- Q2 launch seems aggressive given the feature scope
- We need at least 8 weeks for proper testing
- iOS and Android development in parallel will require 2 dedicated developers

I'd suggest pushing the launch to Q3 2024 or reducing the scope for initial MVP.

Also, regarding the payment gateway - have we considered PayPal as an alternative? Some of our target users prefer it.

Sarah"""
        },
        {
            "from": "mike.chen@company.com",
            "to": "sarah.smith@company.com, john.doe@company.com",
            "date": "2024-01-16T10:15:00Z",
            "subject": "Technical Constraints - Mobile App",
            "body": """Team,

From a technical perspective, here are some constraints we need to consider:

1. Offline mode will require significant local database implementation
2. Push notifications need backend infrastructure setup
3. Payment gateway integration requires PCI compliance

Given these technical requirements, I agree with Sarah that Q2 is too tight. We should plan for Q3 launch with a phased rollout:
- Phase 1 (MVP): Basic browsing and cart (8 weeks)
- Phase 2: Payment integration (4 weeks)
- Phase 3: Advanced features (4 weeks)

Total: 16 weeks = Q3 2024

Mike Chen
Tech Lead"""
        },
        {
            "from": "emma.wilson@company.com",
            "to": "john.doe@company.com",
            "date": "2024-01-17T11:30:00Z",
            "subject": "Stakeholder Feedback - Mobile App",
            "body": """John,

I met with the executive team yesterday. Here's their feedback:

MUST HAVE:
- Social media login (Facebook, Google)
- Product recommendations based on browsing history
- One-click checkout
- Customer reviews and ratings

NICE TO HAVE:
- AR product preview
- Voice search
- Loyalty points integration

They're flexible on timeline but insist on Q3 launch maximum.

Budget increase approved to $200K if needed for quality.

Emma
Product Manager"""
        },
        {
            "from": "david.brown@company.com",
            "to": "team@company.com",
            "date": "2024-01-18T09:00:00Z",
            "subject": "URGENT: Compliance Requirements",
            "body": """All,

Legal team has flagged that we MUST include:

1. GDPR compliance for EU users
2. CCPA compliance for California users
3. Cookie consent management
4. Data retention policies (delete user data on request)
5. Terms of Service and Privacy Policy updates

This is non-negotiable and must be included in MVP.

Also, we need to conduct a security audit before launch. Budget additional $15K for this.

David Brown
Legal & Compliance"""
        }
    ]
    
    output_path = '../demo-data/processed/project_emails.json'
    with open(output_path, 'w') as f:
        json.dump(emails, f, indent=2)
    
    print(f"✅ Generated {len(emails)} project emails -> {output_path}")
    return emails

def generate_sample_meeting_transcripts():
    """Generate sample meeting transcripts"""
    meetings = [
        {
            "meeting_id": "kickoff_meeting_001",
            "date": "2024-01-10T14:00:00Z",
            "duration_minutes": 60,
            "participants": ["John Doe", "Sarah Smith", "Mike Chen", "Emma Wilson"],
            "transcript": """
[14:00] John Doe: Alright everyone, let's get started. This is our kickoff meeting for the mobile app project. Sarah, can you give us an overview?

[14:02] Sarah Smith: Sure. We're building a mobile e-commerce app for both iOS and Android. The main goal is to increase mobile sales by 40% in the first year. Key features include product browsing, search, cart management, checkout, and user accounts.

[14:05] Mike Chen: From a technical standpoint, we're looking at React Native for cross-platform development. This will allow us to share about 80% of the codebase between iOS and Android.

[14:07] Emma Wilson: Great. What about the timeline? Marketing wants to launch during the holiday season.

[14:08] John Doe: That would be Q4 2024. Do we think that's feasible?

[14:10] Mike Chen: If we start development next month, we could have an MVP by Q2, then add features incrementally. Q4 launch is doable but tight.

[14:12] Sarah Smith: We need to prioritize features. What's absolutely essential for launch?

[14:15] Emma Wilson: Based on user research, the must-haves are: easy product discovery, smooth checkout process, and saved payment methods. Everything else can wait.

[14:18] John Doe: Okay, let's document that. Sarah, can you draft the BRD based on this discussion?

[14:20] Sarah Smith: Will do. I'll have a draft by end of week.

[14:22] John Doe: Perfect. Let's meet weekly to track progress. Meeting adjourned.
            """,
            "summary": "Kickoff meeting for mobile app project. Agreed on React Native for development, Q4 2024 launch target, and prioritized must-have features: product discovery, checkout, and saved payments.",
            "action_items": [
                "Sarah to draft BRD by end of week",
                "Mike to prepare technical architecture document",
                "Emma to conduct user research on payment preferences"
            ],
            "decisions": [
                "Use React Native for cross-platform development",
                "Target Q4 2024 for launch",
                "MVP feature set: browsing, search, cart, checkout, accounts"
            ]
        },
        {
            "meeting_id": "requirements_review_002",
            "date": "2024-01-20T15:00:00Z",
            "duration_minutes": 45,
            "participants": ["Sarah Smith", "Mike Chen", "David Brown"],
            "transcript": """
[15:00] Sarah Smith: Thanks for joining. I want to review the requirements document before we finalize it.

[15:02] Mike Chen: I reviewed the technical requirements. One concern - you've listed offline mode as a must-have. That adds significant complexity.

[15:05] Sarah Smith: The user research showed that 30% of our users have unreliable internet. Can we do a limited offline mode?

[15:07] Mike Chen: We could cache product catalogs and allow browsing offline, but checkout would still require internet. That's a reasonable compromise.

[15:10] David Brown: From a legal perspective, we need to add compliance requirements. GDPR and CCPA are mandatory, not optional.

[15:12] Sarah Smith: Got it. I'll move those to the must-have section. Anything else?

[15:15] David Brown: Yes, we need explicit user consent for data collection, especially for analytics and marketing purposes.

[15:18] Mike Chen: That means we need a consent management UI in the onboarding flow.

[15:20] Sarah Smith: Okay, I'll add that. Any concerns about the timeline?

[15:22] Mike Chen: If we keep the scope as discussed, Q3 2024 is realistic for MVP. Q4 for full feature set.

[15:25] Sarah Smith: Perfect. I'll update the BRD and circulate for final approval.
            """,
            "summary": "Requirements review meeting. Agreed to implement limited offline mode (caching only), added GDPR/CCPA compliance as must-have features, and confirmed Q3 2024 MVP timeline.",
            "action_items": [
                "Sarah to update BRD with compliance requirements",
                "Mike to scope offline caching implementation",
                "David to prepare compliance checklist"
            ],
            "decisions": [
                "Implement limited offline mode (browse only, no checkout)",
                "GDPR/CCPA compliance required for MVP",
                "Consent management UI in onboarding flow"
            ]
        }
    ]
    
    output_path = '../demo-data/processed/meeting_transcripts.json'
    with open(output_path, 'w') as f:
        json.dump(meetings, f, indent=2)
    
    print(f"✅ Generated {len(meetings)} meeting transcripts -> {output_path}")
    return meetings

def generate_sample_slack_messages():
    """Generate sample Slack messages"""
    messages = [
        {
            "user": "sarah_pm",
            "text": "Hey team, quick update: budget meeting went well. We got approval for $200K!",
            "timestamp": "2024-01-19T09:15:00Z",
            "channel": "mobile-app-project",
            "reactions": [{"emoji": "tada", "count": 5}]
        },
        {
            "user": "mike_tech",
            "text": "Great news! That gives us room to hire an additional developer.",
            "timestamp": "2024-01-19T09:17:00Z",
            "channel": "mobile-app-project"
        },
        {
            "user": "emma_product",
            "text": "Should we use that budget for push notification infrastructure? It's a highly requested feature.",
            "timestamp": "2024-01-19T09:20:00Z",
            "channel": "mobile-app-project"
        },
        {
            "user": "john_ceo",
            "text": "Push notifications are essential. Approve that spend.",
            "timestamp": "2024-01-19T09:25:00Z",
            "channel": "mobile-app-project",
            "reactions": [{"emoji": "100", "count": 3}]
        },
        {
            "user": "david_legal",
            "text": "Reminder: we need to include opt-in consent for push notifications. GDPR requirement.",
            "timestamp": "2024-01-19T09:30:00Z",
            "channel": "mobile-app-project"
        },
        {
            "user": "sarah_pm",
            "text": "Good catch David. I'll add that to the requirements doc.",
            "timestamp": "2024-01-19T09:32:00Z",
            "channel": "mobile-app-project"
        },
        {
            "user": "mike_tech",
            "text": "Question: are we supporting iOS 14+ or iOS 15+ only?",
            "timestamp": "2024-01-19T10:00:00Z",
            "channel": "mobile-app-project"
        },
        {
            "user": "emma_product",
            "text": "Analytics show 85% of our users are on iOS 15+. I'd say we can drop iOS 14 support.",
            "timestamp": "2024-01-19T10:05:00Z",
            "channel": "mobile-app-project"
        },
        {
            "user": "sarah_pm",
            "text": "Agreed. iOS 15+ and Android 11+ minimum. That simplifies things.",
            "timestamp": "2024-01-19T10:07:00Z",
            "channel": "mobile-app-project"
        },
        {
            "user": "mike_tech",
            "text": "Perfect. That means we can use the latest React Native features without compatibility hacks.",
            "timestamp": "2024-01-19T10:10:00Z",
            "channel": "mobile-app-project"
        }
    ]
    
    output_path = '../demo-data/processed/slack_messages.json'
    with open(output_path, 'w') as f:
        json.dump(messages, f, indent=2)
    
    print(f"✅ Generated {len(messages)} Slack messages -> {output_path}")
    return messages

def create_sample_uploads():
    """Create sample upload files"""
    # Sample requirements.txt content
    requirements_content = """# Mobile App Project - Initial Requirements

## Project Overview
Build a cross-platform mobile e-commerce application for iOS and Android.

## Target Launch
Q3-Q4 2024

## Key Stakeholders
- John Doe (CEO)
- Sarah Smith (Project Manager)
- Mike Chen (Tech Lead)
- Emma Wilson (Product Manager)
- David Brown (Legal & Compliance)

## High-Level Requirements

### Must Have (P0)
1. User authentication (email, social login)
2. Product catalog browsing
3. Search functionality
4. Shopping cart
5. Checkout process
6. Payment integration (Stripe)
7. Order history
8. Push notifications
9. GDPR/CCPA compliance

### Should Have (P1)
1. Product recommendations
2. Wishlist
3. Product reviews and ratings
4. Limited offline mode
5. Multiple payment methods

### Could Have (P2)
1. AR product preview
2. Voice search
3. Loyalty program integration
4. Social sharing

## Technical Constraints
- React Native for cross-platform development
- iOS 15+ and Android 11+ minimum
- Backend: Node.js + MongoDB
- Payment: Stripe API
- Push: Firebase Cloud Messaging

## Budget
$200,000 approved

## Success Metrics
- 40% increase in mobile sales (Year 1)
- 4.5+ star rating on app stores
- 100K+ downloads in first 3 months
- <2% cart abandonment rate
"""
    
    requirements_path = '../demo-data/sample-uploads/requirements.txt'
    with open(requirements_path, 'w') as f:
        f.write(requirements_content)
    
    print(f"✅ Created sample requirements.txt -> {requirements_path}")
    
    # Note about PDF
    print("ℹ️  Note: sample_doc.pdf would need to be created manually or with a PDF library")
    print("    For demo purposes, the requirements.txt file is sufficient")

def main():
    """Main preprocessing function"""
    print("="*60)
    print("🚀 ReqForge AI - Demo Data Preprocessing")
    print("="*60)
    print()
    
    try:
        # Step 1: Create directories
        print("📁 Step 1: Creating directory structure...")
        create_directory_structure()
        print()
        
        # Step 2: Generate emails
        print("📧 Step 2: Generating sample project emails...")
        generate_sample_project_emails()
        print()
        
        # Step 3: Generate meetings
        print("🎤 Step 3: Generating sample meeting transcripts...")
        generate_sample_meeting_transcripts()
        print()
        
        # Step 4: Generate Slack messages
        print("💬 Step 4: Generating sample Slack messages...")
        generate_sample_slack_messages()
        print()
        
        # Step 5: Create sample uploads
        print("📄 Step 5: Creating sample upload files...")
        create_sample_uploads()
        print()
        
        print("="*60)
        print("✅ All demo data preprocessed successfully!")
        print("="*60)
        print()
        print("📊 Summary:")
        print("  - Project emails: demo-data/processed/project_emails.json")
        print("  - Meeting transcripts: demo-data/processed/meeting_transcripts.json")
        print("  - Slack messages: demo-data/processed/slack_messages.json")
        print("  - Sample uploads: demo-data/sample-uploads/requirements.txt")
        print()
        print("🎯 Next step: Run the application and upload these files!")
        
    except Exception as e:
        print(f"❌ Error during preprocessing: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()