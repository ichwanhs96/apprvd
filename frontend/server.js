// For Pandoc
import { exec } from 'child_process'

// Function to convert DOCX to HTML using pandoc
function convertDocxToHtml(inputPath, outputPath) {
  const command = `pandoc "${inputPath}" -f docx -t html -s -o "${outputPath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Successfully converted ${inputPath} to ${outputPath}`);
  });
}

// Example usage
const inputPath = "./exportcontent.docx"; // Update with your DOCX file path
const outputPath = "output.html"; // Update with desired output HTML file path

convertDocxToHtml(inputPath, outputPath);
