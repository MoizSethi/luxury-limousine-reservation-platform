import React from 'react';
import {
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Typography,
  Box
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Link,
  Image
} from '@mui/icons-material';

// Simple formatting functions
const formatText = (text, format) => {
  const formats = {
    bold: { prefix: '**', suffix: '**' },
    italic: { prefix: '*', suffix: '*' },
    underline: { prefix: '<u>', suffix: '</u>' },
  };
  
  const formatObj = formats[format];
  return `${formatObj.prefix}${text}${formatObj.suffix}`;
};

const formatList = (text, type) => {
  const lines = text.split('\n');
  if (type === 'bullet') {
    return lines.map(line => line ? `- ${line}` : '').join('\n');
  } else {
    return lines.map((line, index) => line ? `${index + 1}. ${line}` : '').join('\n');
  }
};

export const TextEditor = ({
  content,
  setContent,
  selectedText,
  setSelectedText
}) => {
  const handleFormat = (format) => {
    if (!selectedText) return;
    
    const formattedText = formatText(selectedText, format);
    const newContent = content.replace(selectedText, formattedText);
    setContent(newContent);
  };

  const handleListFormat = (type) => {
    if (!selectedText) return;
    
    const formattedText = formatList(selectedText, type);
    const newContent = content.replace(selectedText, formattedText);
    setContent(newContent);
  };

  const handleTextSelection = (e) => {
    const text = e.target.value.substring(
      e.target.selectionStart,
      e.target.selectionEnd
    );
    setSelectedText(text);
  };

  return (
    <Box>
      {/* Formatting Toolbar */}
      <Paper sx={{ p: 1, mb: 2, bgcolor: 'grey.100' }}>
        <ToggleButtonGroup size="small" sx={{ flexWrap: 'wrap' }}>
          <ToggleButton value="bold" onClick={() => handleFormat('bold')}>
            <FormatBold />
          </ToggleButton>
          <ToggleButton value="italic" onClick={() => handleFormat('italic')}>
            <FormatItalic />
          </ToggleButton>
          <ToggleButton value="underline" onClick={() => handleFormat('underline')}>
            <FormatUnderlined />
          </ToggleButton>
          <ToggleButton value="bullet" onClick={() => handleListFormat('bullet')}>
            <FormatListBulleted />
          </ToggleButton>
          <ToggleButton value="number" onClick={() => handleListFormat('number')}>
            <FormatListNumbered />
          </ToggleButton>
          <ToggleButton value="link">
            <Link />
          </ToggleButton>
          <ToggleButton value="image">
            <Image />
          </ToggleButton>
        </ToggleButtonGroup>
        
        {selectedText && (
          <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
            Selected: "{selectedText}"
          </Typography>
        )}
      </Paper>

      {/* Content Textarea */}
      <TextField
        label="Article Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onSelect={handleTextSelection}
        placeholder="Write your article content here...
        
You can use simple formatting:
**Bold text**
*Italic text*
<u>Underlined text</u>

- Bullet points
1. Numbered lists

Or select text and use the formatting buttons above."
        multiline
        rows={15}
        fullWidth
      />

      {/* Formatting Help */}
      <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Formatting Help:
        </Typography>
        <Typography variant="body2">
          • <strong>**Bold**</strong> - Use ** around text<br/>
          • <em>*Italic*</em> - Use * around text<br/>
          • <u>Underline</u> - Use &lt;u&gt;text&lt;/u&gt;<br/>
          • Lists: Start with - or 1. 2. 3.
        </Typography>
      </Box>
    </Box>
  );
};