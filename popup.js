//global variables
var listItems, items;
//Add eventListener to button onclick => Inline javascript == onclick() && inline javascript == forbidden
document.addEventListener('DOMContentLoaded', function() {
    //init globals here
    //first let the page get loaded then do this:
    listItems = document.getElementById("categoriesList");
    var addButton = document.getElementById('addBtn');
    var saveChangesButton = document.getElementById('saveChgBtn');
    // onClick's logic:
    //For addButton => add new category
    addButton.addEventListener('click', function() {
        addCategory();       
    });
    //for saveChangesButton => save changes made to storage
    saveChangesButton.addEventListener('click', function(){
        setCategories();
    })
});

//Add new Category to the UL 
function addCategory(){
    //init
    var newCategory;   
    
    newCategory = document.getElementById('newCategory').value;
    //If not empty input execute
    if(newCategory != "" && newCategory != null){
        newCategory = document.getElementById('newCategory').value;
        let row = addRow(newCategory);
        listItems.appendChild(row);
        //reset inputfield
        document.getElementById('newCategory').value = '';    
    }
}
//Save the categories from every tablerow
function setCategories() {
    // console.log(listItems.innerHTML.split("</li>"));
    var items = listItems.innerHTML.split("</tr>");
    for(let i = 0; i < items.length-1; i++){
        items[i] = items[i].split("<p>")[1].split("</p>")[0]; 
    }
    chrome.storage.local.set({'categories': items});   
}

//Create btn for tabledata
function createBtnTd(textBtn){
    var td, btn;
    td = document.createElement('td');
    btn = document.createElement('button');
    btn.innerHTML = textBtn;    
    td.appendChild(btn);
    return td;
}
function deleteBtn(row){
    row.parentNode.removeChild(row);
}

//remove the elements from the inside and replace them with new elements so u can edit
function editButton(row){
    let editfield, text, btnOk,td;
    var category;

    editfield = document.createElement('input');
    td = document.createElement("td");
    td.appendChild(editfield);
    editfield.type= "text";

    btnOk = createBtnTd("Ok");
    category = row.firstChild.firstChild.innerHTML;
    text = row.firstChild;
    while(text != null){
        row.removeChild(text);
        text = row.firstChild;
    }
    //Set the editfield which will be generated to the current string which u want to edit
    editfield.value = category;
    row.appendChild(td);
    row.appendChild(btnOk);
    btnOk.addEventListener('click', function() {
        //value inputfield
        let editVal = this.parentNode.firstChild.firstChild.value;
        //remove again all nodes and append again
        while(row.firstChild != null){
            row.removeChild(row.firstChild);
        }
        let data = document.createElement('td');
        let category = document.createElement('p');
        category.innerHTML = editVal;
        data.appendChild(category);
        delBtn = createBtnTd("Delete");

        editBtn = createBtnTd("Edit");
        
        row.appendChild(data);
        row.appendChild(delBtn);
        row.appendChild(editBtn);

        //Eventlisteners for buttons again
        delBtn.addEventListener('click', function() {
                deleteBtn(row);       
            });
        editBtn.addEventListener('click', function() {
            editButton(row);       
        });
             
    });
}

//Performance lose beacause u create everytime a new btn 
//everytime this method is called and btns are always the same
//fix it with global variable
function addRow(newCategory){
    var newRow, data, category, delBtn, editBtn;
    //Create tr node and append it table
    newRow = document.createElement('tr');
    
    data = document.createElement('td');
    category = document.createElement('p');
    category.innerHTML = newCategory;
    data.appendChild(category);
    // data.innerHTML = newCategory;

    
    delBtn = createBtnTd("Delete");

    editBtn = createBtnTd("Edit");
    // editBtn.onclick = editeBtn(this);
    
    newRow.appendChild(data);
    newRow.appendChild(delBtn);
    newRow.appendChild(editBtn);

    return newRow;
}
//Add every category to a row
//Add the onclicklistener only here because else the element is not yet defined
function getCategories() {
    chrome.storage.local.get('categories', function(result){
        items = result.categories;
        for(let i = 0; i < items.length-1; i++){
            //Add a new row for each category
            let row = addRow(items[i]);
            let delBtn = row.childNodes[1].firstChild;
            let editBtn = row.childNodes[2].firstChild;
            delBtn.addEventListener('click', function() {
                deleteBtn(row);       
            });
            editBtn.addEventListener('click', function() {
                editButton(row);       
            });
            listItems.appendChild(row);
        }
    }); 
}

window.onload = function() {
    getCategories();
  // document.getElementById("bookmarks").innerHTML = bookmarksprint() ;
//   chrome.bookmarks.getTree(function(itemTree){
//       itemTree.forEach(function(item){
//           console.log(item);
//           processNode(item);
//       });
//   });
}



// function processNode(node) {
//     // recursively process child nodes
//     if(node.children) {
//         node.children.forEach(function(child) { processNode(child); });
//     }
//     // print leaf nodes URLs to console
//     if(node.url) { console.log(node.url); }
// }

// function bookmarksprint(){
//   return "<p>" + chrome.bookmarks.getTree(function callback(){})+ "</p>";
// }

// function printBookmarks(id) {
//   var output = "<ul>";
//  chrome.bookmarks.getChildren(id, function(children) {
//     children.forEach(function(bookmark) {
//       output+= "<li>" + bookmark.name + "</li>";
//     });
//     output+= "</ul>";
//  });
//  return output;
// }
function saveChanges() {
    // Get a value saved in a form.
    var category = textarea.value;
    // Check that there's some code there.
    if (!theValue) {
        message('Error: No value specified');
        return;
    }
    // Save it using the Chrome extension storage API.
    // chrome.storage.sync.set({'Category': category}, function() {
        chrome.storage.set({'Category': category}, function() {
        // Notify that we saved.
        message('Settings saved');
    });
}
