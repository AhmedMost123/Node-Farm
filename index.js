const fs = require("fs");
const http = require("http");
const url = require("url");
//importing modules
const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate");
/////////////////////////////
//FILES

// Blocking, synchronous way
/* const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);
const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File written!"); */

// Non-blocking, synchronous way
// Read the file without blocking the next code
/* fs.readFile("./txt/starttt.txt", "utf-8", (err, data1) => {
  if (err) return console.log("ERROR!");
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
      console.log(data3);
      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        console.log("your file has been written");
      });
    });
  });
}); */
//////////
// Server
//top level code read once

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) =>
  slugify(el.productName, {
    lower: true,
  })
);
console.log(slugs);
/* console.log(
  slugify("Fresh Avocados", {
    lower: true,
  })
); */
const server = http.createServer((req, res) => {
  //to parse the variable out of url
  const { query, pathname: pathName } = url.parse(req.url, true);
  //true to parse the query(?id=value) to  object

  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, {
      "content-type": "text/html",
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  }
  // Product
  else if (pathName === "/product") {
    res.writeHead(200, {
      "content-type": "text/html",
    });
    const product = dataObj.at(query.id);
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else if (pathName === "/api") {
    //instead of "./dev-data/data.json"
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found</h1>");
  }
});
//http://127.0.0.1:8000/
//local host : port(address)
/* When you deploy to a hosting provider:

They don’t allow you to pick your own port.

They give you one automatically through an environment variable:
process.env.PORT. */
const PORT = process.env.PORT || 8000;
server.listen(PORT, "127.0.0.1", () => {
  console.log(`Listening to request on port ${PORT}`);
}); //standaard ip address
