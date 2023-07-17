// Imports File System module
const fs = require("fs");

// Imports inquirer
const inquirer = require("inquirer");

// Imports class from ./lib/shapes directory
const { Triangle, Square, Circle } = require("./lib/shapes");

// Function writes the SVG file using user answers from inquirer prompts
function writeToFile(fileName, answers) {
  // File will start as an empty string
  let svgString = "";
  // Sets width and height of logo the container
  svgString =
    '<svg version="1.1" width="400" height="300" xmlns="http://www.w3.org/2000/svg">';
  // <g> tag wraps <text> tag so that the user font input layers on top of polygon -> not behind
  svgString += "<g>";
  // Takes the users input for shape choice and inserts it into SVG file
  svgString += `${answers.shape}`;

  // Conditional check takes users input from choices array and adds polygon properties and shape color to SVG string
  let shapeChoice;
  if (answers.shape === "Triangle") {
    shapeChoice = new Triangle();
    svgString += `<polygon points="150, 18 244, 182 56, 182" fill="${answers.shapeBackgroundColor}"/>`;
  } else if (answers.shape === "Square") {
    shapeChoice = new Square();
    svgString += `<rect x="73" y="40" width="160" height="160" fill="${answers.shapeBackgroundColor}"/>`;
  } else {
    shapeChoice = new Circle();
    svgString += `<circle cx="150" cy="115" r="80" fill="${answers.shapeBackgroundColor}"/>`;
  }

  // <text> tag gives rise to text alignment, text-content/text-color taken in from user prompt and gives default font size of "40"
  svgString += `<text x="150" y="130" text-anchor="middle" font-size="40" fill="${answers.textColor}">${answers.text}</text>`;
  // Closing </g> tag
  svgString += "</g>";
  // Closing </svg> tag
  svgString += "</svg>";

  // Using file system module to generate svg file, takes in file name given in the promptUser function, the svg string, and a ternary operator which handles logging any errors, or a "Generated logo.svg" message to the console  
  fs.writeFile(fileName, svgString, (err) => {
    err ? console.log(err) : console.log("Generated logo.svg");
  });
}

// This function utilizes inquirer .prompt to prompt the user to answer questions in the command line and save users input
function promptUser() {
  inquirer
    .prompt([
      // Shape choice prompt
      {
        type: "list",
        message: "What shape would you like the logo to render?",
        choices: ["Triangle", "Square", "Circle"],
        name: "shape",
      },
      // Shape color prompt
      {
        type: "input",
        message: "Choose SHAPE COLOR (Enter color OR a hex number)",
        name: "shapeBackgroundColor",
      },
      // Text prompt
      {
        type: "input",
        message: "Choose TEXT (Enter up to 3 characters)",
        name: "text",
      },
      // Text color prompt
      {
        type: "input",
        message: "Choose TEXT COLOR (Enter color OR a hex number)",
        name: "textColor",
      },
    ])
    .then((answers) => {
      // Error for text prompt (must enter 3 characters or less for logo to generate)
      if (answers.text.length > 3) {
        console.log("Must enter a value of no more than 3 characters");
        promptUser();
      } else {
        // Calling write to file function to generate SVG file
        writeToFile("logo.svg", answers);
      }
    });
}

// Calling promptUser function so inquirer prompts fire off when application is ran
promptUser();
