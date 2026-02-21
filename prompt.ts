export default `
# Card filter evaluator

Determine if the given card object matches the given filter description:

"$QUERY"

## Output
Return **only** \`true\` or \`false\`

===

Card:
\`\`\` card.json
$CARD
\`\`\`
`;