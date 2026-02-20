"""
Helper utility functions for the AI service
"""

import json
import re
from datetime import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path


def format_timestamp(dt: Optional[datetime] = None) -> str:
    """
    Format datetime to ISO string
    
    Args:
        dt: Datetime object. If None, uses current time
        
    Returns:
        ISO formatted timestamp string
    """
    if dt is None:
        dt = datetime.now()
    return dt.isoformat()


def load_json_file(file_path: str) -> Dict[str, Any]:
    """
    Load JSON file safely
    
    Args:
        file_path: Path to JSON file
        
    Returns:
        Dictionary containing JSON data, empty dict if error
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"⚠️  File not found: {file_path}")
        return {}
    except json.JSONDecodeError as e:
        print(f"⚠️  Invalid JSON in {file_path}: {str(e)}")
        return {}
    except Exception as e:
        print(f"⚠️  Error loading {file_path}: {str(e)}")
        return {}


def save_json_file(data: Dict[str, Any], file_path: str, indent: int = 2) -> bool:
    """
    Save dictionary to JSON file
    
    Args:
        data: Dictionary to save
        file_path: Output file path
        indent: JSON indentation level
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Create directory if it doesn't exist
        Path(file_path).parent.mkdir(parents=True, exist_ok=True)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=indent, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"❌ Error saving to {file_path}: {str(e)}")
        return False


def extract_url_from_text(text: str) -> List[str]:
    """
    Extract URLs from text using regex
    
    Args:
        text: Input text containing URLs
        
    Returns:
        List of extracted URLs
    """
    url_pattern = r'https?://[^\s<>"{}|\\^`\[\]]+'
    urls = re.findall(url_pattern, text)
    return urls


def sanitize_filename(filename: str, max_length: int = 255) -> str:
    """
    Sanitize filename by removing invalid characters
    
    Args:
        filename: Original filename
        max_length: Maximum filename length
        
    Returns:
        Sanitized filename
    """
    # Remove invalid characters
    sanitized = re.sub(r'[<>:"/\\|?*]', '_', filename)
    
    # Remove leading/trailing spaces and dots
    sanitized = sanitized.strip('. ')
    
    # Truncate if too long
    if len(sanitized) > max_length:
        name, ext = sanitized.rsplit('.', 1) if '.' in sanitized else (sanitized, '')
        max_name_length = max_length - len(ext) - 1
        sanitized = f"{name[:max_name_length]}.{ext}" if ext else name[:max_length]
    
    return sanitized or 'unnamed_file'


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 100) -> List[str]:
    """
    Split text into overlapping chunks
    
    Args:
        text: Input text to chunk
        chunk_size: Size of each chunk in characters
        overlap: Overlap between chunks in characters
        
    Returns:
        List of text chunks
    """
    if len(text) <= chunk_size:
        return [text]
    
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        
        # Try to break at sentence boundary
        if end < len(text):
            # Look for sentence ending in the last 100 characters of chunk
            last_period = text[end-100:end].rfind('.')
            if last_period != -1:
                end = end - 100 + last_period + 1
        
        chunks.append(text[start:end].strip())
        start = end - overlap
    
    return chunks


def calculate_confidence_score(sources: List[Dict[str, Any]]) -> float:
    """
    Calculate confidence score based on number and quality of sources
    
    Args:
        sources: List of source dictionaries
        
    Returns:
        Confidence score between 0.0 and 1.0
    """
    if not sources:
        return 0.0
    
    # Base score on number of sources
    num_sources = len(sources)
    base_score = min(num_sources / 5.0, 0.8)  # Max 0.8 from quantity
    
    # Quality bonus based on source types
    source_types = set()
    for source in sources:
        source_type = source.get('type', 'unknown')
        source_types.add(source_type)
    
    # More diverse sources = higher confidence
    diversity_bonus = len(source_types) * 0.05  # 0.05 per unique type
    
    total_score = min(base_score + diversity_bonus, 1.0)
    return round(total_score, 2)


def merge_dictionaries(*dicts: Dict[str, Any]) -> Dict[str, Any]:
    """
    Deep merge multiple dictionaries
    
    Args:
        *dicts: Variable number of dictionaries to merge
        
    Returns:
        Merged dictionary
    """
    result = {}
    
    for d in dicts:
        for key, value in d.items():
            if key in result and isinstance(result[key], dict) and isinstance(value, dict):
                result[key] = merge_dictionaries(result[key], value)
            else:
                result[key] = value
    
    return result


def extract_requirements_from_text(text: str) -> List[str]:
    """
    Extract potential requirements from text
    
    Args:
        text: Input text
        
    Returns:
        List of extracted requirement statements
    """
    requirements = []
    
    # Common requirement indicators
    indicators = [
        r'must\s+(?:have|be|include|support)',
        r'should\s+(?:have|be|include|support)',
        r'shall\s+(?:have|be|include|support)',
        r'required?\s+to',
        r'needs?\s+to',
        r'(?:will|would)\s+(?:have|include|support)',
    ]
    
    pattern = '|'.join(indicators)
    sentences = re.split(r'[.!?]+', text)
    
    for sentence in sentences:
        sentence = sentence.strip()
        if re.search(pattern, sentence, re.IGNORECASE):
            if len(sentence.split()) >= 5:  # Minimum 5 words
                requirements.append(sentence)
    
    return requirements


def detect_conflicts_in_requirements(requirements: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Detect potential conflicts between requirements
    
    Args:
        requirements: List of requirement dictionaries
        
    Returns:
        List of detected conflicts
    """
    conflicts = []
    conflict_patterns = [
        (r'\bmust\b.*\bnot\b', r'\bmust\b'),  # Must vs must not
        (r'\bq[1-4]\b', r'\bq[1-4]\b'),  # Different quarters
        (r'\$[\d,]+', r'\$[\d,]+'),  # Different budget amounts
        (r'\d+\s*(?:weeks?|months?|days?)', r'\d+\s*(?:weeks?|months?|days?)'),  # Different timelines
    ]
    
    for i, req1 in enumerate(requirements):
        for j, req2 in enumerate(requirements[i+1:], start=i+1):
            text1 = req1.get('text', '').lower()
            text2 = req2.get('text', '').lower()
            
            for pattern1, pattern2 in conflict_patterns:
                match1 = re.search(pattern1, text1, re.IGNORECASE)
                match2 = re.search(pattern2, text2, re.IGNORECASE)
                
                if match1 and match2 and match1.group() != match2.group():
                    conflicts.append({
                        'id': f'conflict_{len(conflicts) + 1}',
                        'type': 'value_mismatch',
                        'requirement_1': req1,
                        'requirement_2': req2,
                        'description': f"Potential conflict: '{match1.group()}' vs '{match2.group()}'"
                    })
    
    return conflicts


def format_brd_section(section_id: str, content: Any) -> str:
    """
    Format BRD section for display
    
    Args:
        section_id: Section identifier
        content: Section content (string, dict, or list)
        
    Returns:
        Formatted section text
    """
    title = section_id.replace('_', ' ').title()
    
    if isinstance(content, str):
        return f"## {title}\n\n{content}\n\n"
    elif isinstance(content, dict):
        formatted = f"## {title}\n\n"
        for key, value in content.items():
            sub_title = key.replace('_', ' ').title()
            formatted += f"### {sub_title}\n{value}\n\n"
        return formatted
    elif isinstance(content, list):
        formatted = f"## {title}\n\n"
        for i, item in enumerate(content, 1):
            formatted += f"{i}. {item}\n"
        return formatted + "\n"
    else:
        return f"## {title}\n\n{str(content)}\n\n"


def parse_smart_objectives(text: str) -> Dict[str, List[str]]:
    """
    Parse SMART objectives from text
    
    Args:
        text: Input text containing objectives
        
    Returns:
        Dictionary with SMART categories
    """
    smart = {
        'specific': [],
        'measurable': [],
        'achievable': [],
        'relevant': [],
        'time_bound': []
    }
    
    # Look for measurable patterns (numbers, percentages, metrics)
    measurable_pattern = r'(?:\d+%|\d+\s*(?:users?|sales?|customers?)|increase.*\d+|reduce.*\d+)'
    if re.search(measurable_pattern, text, re.IGNORECASE):
        smart['measurable'].append(text)
    
    # Look for time-bound patterns
    time_pattern = r'\b(?:by|within|in)\s+(?:\d+\s*(?:months?|weeks?|days?|years?)|q[1-4]|january|february|march|april|may|june|july|august|september|october|november|december)\b'
    if re.search(time_pattern, text, re.IGNORECASE):
        smart['time_bound'].append(text)
    
    return smart


def extract_stakeholders(text: str) -> List[Dict[str, str]]:
    """
    Extract stakeholder information from text
    
    Args:
        text: Input text
        
    Returns:
        List of stakeholder dictionaries
    """
    stakeholders = []
    
    # Pattern to match names with roles
    # E.g., "John Doe (CEO)", "Sarah Smith - Product Manager"
    patterns = [
        r'([A-Z][a-z]+\s+[A-Z][a-z]+)\s*[\(\-]\s*([A-Z][A-Za-z\s]+)[\)]',
        r'([A-Z][a-z]+\s+[A-Z][a-z]+),\s*([A-Z][A-Za-z\s]+)',
    ]
    
    for pattern in patterns:
        matches = re.finditer(pattern, text)
        for match in matches:
            stakeholders.append({
                'name': match.group(1).strip(),
                'role': match.group(2).strip()
            })
    
    # Deduplicate by name
    seen_names = set()
    unique_stakeholders = []
    for stakeholder in stakeholders:
        if stakeholder['name'] not in seen_names:
            seen_names.add(stakeholder['name'])
            unique_stakeholders.append(stakeholder)
    
    return unique_stakeholders


def validate_brd_completeness(brd_content: Dict[str, Any], template: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate BRD completeness against template
    
    Args:
        brd_content: Generated BRD content
        template: Template structure
        
    Returns:
        Validation result with completeness score
    """
    required_sections = [
        section['id'] 
        for section in template.get('sections', []) 
        if section.get('required', False)
    ]
    
    completed_sections = [
        section_id 
        for section_id in required_sections 
        if section_id in brd_content and brd_content[section_id]
    ]
    
    completeness_percentage = (
        len(completed_sections) / len(required_sections) * 100 
        if required_sections else 0
    )
    
    missing_sections = [
        section_id 
        for section_id in required_sections 
        if section_id not in completed_sections
    ]
    
    return {
        'is_complete': completeness_percentage == 100,
        'completeness_percentage': round(completeness_percentage, 1),
        'completed_sections': len(completed_sections),
        'total_required_sections': len(required_sections),
        'missing_sections': missing_sections
    }


def create_requirement_id(requirement_text: str, index: int) -> str:
    """
    Create unique requirement ID
    
    Args:
        requirement_text: Requirement text
        index: Requirement index
        
    Returns:
        Unique requirement ID
    """
    # Take first 3 words and create abbreviation
    words = requirement_text.split()[:3]
    abbreviation = ''.join([w[0].upper() for w in words if w])
    
    return f"REQ-{abbreviation}-{index:03d}"


# Export all functions
__all__ = [
    'format_timestamp',
    'load_json_file',
    'save_json_file',
    'extract_url_from_text',
    'sanitize_filename',
    'chunk_text',
    'calculate_confidence_score',
    'merge_dictionaries',
    'extract_requirements_from_text',
    'detect_conflicts_in_requirements',
    'format_brd_section',
    'parse_smart_objectives',
    'extract_stakeholders',
    'validate_brd_completeness',
    'create_requirement_id'
]