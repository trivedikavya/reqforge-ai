import json
import os

class TemplateService:
    def __init__(self):
        self.template_dir = os.path.join(os.path.dirname(__file__), '..', 'templates')
    
    def load_template(self, template_type: str) -> dict:
        """Load BRD template structure"""
        template_file = os.path.join(self.template_dir, f'{template_type}.json')
        
        try:
            with open(template_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            # Return default template
            return self._get_default_template()
    
    def _get_default_template(self) -> dict:
        """Get default comprehensive template"""
        return {
            "sections": [
                {"id": "executive_summary", "title": "Executive Summary"},
                {"id": "business_goals", "title": "Business Goals"},
                {"id": "stakeholders", "title": "Stakeholders"},
                {"id": "scope", "title": "Scope and Limitations"},
                {"id": "functional_requirements", "title": "Functional Requirements"},
                {"id": "non_functional_requirements", "title": "Non-Functional Requirements"},
                {"id": "timeline", "title": "Timeline & Milestones"},
                {"id": "success_metrics", "title": "Success Metrics"}
            ]
        }

template_service = TemplateService()