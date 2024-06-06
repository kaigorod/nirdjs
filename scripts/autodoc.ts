import { OpenAI } from "https://deno.land/x/openai@v4.48.2/mod.ts";

const openai = new OpenAI({
  apiKey: Deno.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

async function generateReadme(fileContent: string): Promise<string | undefined> {
  const prompt = `
  Based on the provided code and meta files, generate a large, helpfull, complete, huge and valuable README.md file for the project. Include the following information:

  1. Project Title.
  2. Project Description.
  3. Installation.
  4. Usage.
  5. Code Examples.
  6. Testing.
  7. Contribution.
  8. License.

  Read the project content from the user message:

  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{
        "role": "system",
        content: prompt
      },
      {
        "role": "user",
        content: fileContent
      }],
    });
    console.log(response)
    const responseText = response.choices[0].message.content.trim()
    console.log(responseText)

    return responseText;
  } catch (error) {
    console.error('Error generating README:', error);
  }
}

const filePath = 'dist/abc.txt';

try {
  const fileContent = await Deno.readTextFile(filePath);

  const readmeContent = await generateReadme(fileContent);

  if (readmeContent) {
    await Deno.writeTextFile('README_GEN.md', readmeContent);
    console.log('README.md file successfully created.');
  }
} catch (error) {
  console.error('Error:', error);
}
