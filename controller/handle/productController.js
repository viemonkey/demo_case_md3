const fs = require("fs");
const qs = require("qs");
const productService = require("../../service/productService")
const categoryService = require('../../service/categoryService')
class ProductController {
    getHtmlProducts = (products, getHtml) => {
        let productHtml = "";
        products.map(item => {
            productHtml += `
                <div class="video anim" style="--delay: .4s">
                    <button id="button1" style="border: none" >
                        <div class="video-time" type="button" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16" onclick="myButton(${item.productId})">
                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                            </svg>
                        </div>
                    </button>
                    <div class="video-wrapper">
                    <img style="width:210px; height:210px" src="${item.image}">
                    </div>
                    <div>
                        <div class="video-name">${item.productName}</div>
                        <div class="video-view">${item.price}</div>
                    </div>
                    <div style="display: flex; justify-content: center; padding-bottom: 10px; column-gap: 10px;" id="button">
                        <a type="button" class="btn btn-outline-info" href="/edit/${item.productId}" id="editButton" style="display: none;">Edit</a>
                        <a type="button" class="btn btn-outline-warning" href="/delete/${item.productId}" id="deleteButton" style="display: none;">Delete</a>
                    </div>
                </div>

                <script>
                    let isDeleteAndEdit = false;
                        function myButton() {
                            let editButton = document.getElementById("editButton");
                            let deleteButton = document.getElementById("deleteButton");
                            isDeleteAndEdit = !isDeleteAndEdit
                            if (isDeleteAndEdit) {
                                editButton.style.display = "inline-block"
                                deleteButton.style.display = "inline-block"
                            } else {
                                editButton.style.display = "none"
                                deleteButton.style.display = "none"

                            }  
                        }
                </script>
            `
        })
        getHtml = getHtml.replace("{productList}", productHtml);
        return getHtml;
    }

    showHome = async (req, res) => {
        if (req.method === 'GET') {
            fs.readFile('./view/index.html', 'utf-8', async (err, indexHtml) => {
                let products = await productService.findAll();
                indexHtml = this.getHtmlProducts(products, indexHtml);
                res.write(indexHtml);
                res.end();
            })
        }
    }

    productAdd = async (req, res) => {
        if (req.method === "GET") {
            let category = await categoryService.findAll()
            fs.readFile("./view/product/add.html", "utf-8", (err, addHtml) => {
             let categoryHtml = ""
             category.map(item => {
                categoryHtml += `<option value="${item.categoryId}">${item.categoryName}</option>`
             })
             addHtml = addHtml.replace("{categories}", categoryHtml)
            res.write(addHtml);
            res.end();
        })
        } else {
            let data = "";
            req.on("data", (chunk) => {
                data += chunk;
            })
            req.on("end", () => {
                let product = qs.parse(data);
                productService.productAdd(product);
                res.writeHead(301, {"location": "/home"});
                res.end();
            })
        }
    }

    productDelete = (req, res, idDelete) => {
        productService.productDelete(idDelete);
        res.writeHead(301, {"location": "/home"});
        res.end();
    }

    producEdit = (req, res,idEdit) => {
        if (req.method === "GET") {
            fs.readFile("./view/product/edit.html", "utf-8", async (err, editHtml) => {
                let products = await productService.findById(idEdit);
                let categories = await categoryService.findAll();
                editHtml = editHtml.replace("{productName}", products.productName);
                editHtml = editHtml.replace("{price}", products.price);
                editHtml = editHtml.replace("{quantity}", products.quantity);
                editHtml = editHtml.replace("{description}", products.description);
                let productHtml = "";
                categories.map(item => {
                    productHtml += `<option value="${item.categoryId}">${item.categoryName}</option>`
                });
                editHtml = editHtml.replace("{categories}", productHtml);
                res.write(editHtml);
                res.end();
            })
        } else {
            let data = ""
            req.on("data", chunk => {
                data += chunk;
            })
            req.on("end", () => {
                let products = qs.parse(data);
                productService.productEdit(idEdit, products);
                res.writeHead(301, {"location": "/home"});
                res.end()
            })
        }
    }

    productSearch = (req, res, nameSearch) => {
       
    }

   
}


module.exports = new ProductController();