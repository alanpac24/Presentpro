# AI Assistant Usage Guide

The AI Assistant is integrated into the presentation editor to help you create and edit slides using natural language commands.

## How to Use

1. **Open the AI Assistant**: Click the sparkles (✨) button in the toolbar
2. **Type your request**: Use natural language to describe what you want
3. **Watch it happen**: The AI will execute the actions on your slide

## Example Commands

### Adding Elements

- "Add a title that says 'Quarterly Review'"
- "Create a bar chart showing sales data"
- "Insert a 3x3 table"
- "Add a blue rectangle in the center"
- "Put a text box with bullet points"

### Creating Charts

- "Create a bar chart with data: Q1: 100, Q2: 150, Q3: 120, Q4: 180"
- "Make a pie chart showing market share: Product A 45%, Product B 30%, Product C 25%"
- "Add a waterfall chart showing revenue changes"
- "Create a line chart tracking growth over 12 months"

### Modifying Elements

- "Change the title color to blue"
- "Make the chart bigger"
- "Update the table to have 5 rows"
- "Change the font size to 24"

### Advanced Features

- "Add a stacked bar chart with CAGR line"
- "Create a chart with smart labels enabled"
- "Make a 100% stacked column chart"
- "Add a waterfall chart with increase/decrease categories"

## API Configuration

The AI Assistant uses OpenAI's API. Make sure your API key is configured in `.env.local`:

```env
OPENAI_API_KEY=your-api-key-here
OPENAI_MODEL=gpt-4o-mini
```

## Supported Actions

1. **addElement**: Creates new text, shapes, charts, or tables
2. **updateElement**: Modifies existing elements
3. **deleteElement**: Removes elements from the slide
4. **alignElements**: Aligns selected elements
5. **distributeElements**: Distributes elements evenly

## Tips

- Be specific about positions: "in the top left", "center of the slide"
- Specify colors by name: "red", "blue", "#3b82f6"
- Include data when creating charts
- Use descriptive language for better results

## Example Conversation

```
You: Create a slide about Q4 performance
AI: I'll create a slide about Q4 performance for you. I'm adding a title and some key elements.

You: Add a bar chart showing monthly revenue
AI: I'm adding a bar chart to display the monthly revenue data for Q4.

You: Make the bars green and add data labels
AI: I've updated the chart with green bars and enabled smart data labels.
```

## Error Handling

If the AI Assistant encounters an error:
- Check your API key is valid
- Ensure you have API credits remaining
- Verify your internet connection
- Try rephrasing your request

The AI Assistant will always show you what actions it's taking, so you can see exactly what changes are being made to your slide.