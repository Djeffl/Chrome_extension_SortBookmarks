//global variables
var listItems, items;

var bookmarksList = [];
var cats = [];


//Add eventListener to button onclick => Inline javascript == onclick() && inline javascript == forbidden
document.addEventListener('DOMContentLoaded', function() {
    //init globals here
    //first let the page get loaded then do this:
    listItems = document.getElementById("categoriesList");
    var addButton = document.getElementById('addBtn');
    var saveChangesButton = document.getElementById('saveChgBtn');
    var createbookmarksButton = document.getElementById('createBmBtn');
    // onClick's logic:
    //For addButton => add new category
    addButton.addEventListener('click', function() {
        addCategory();       
    });
    //for saveChangesButton => save changes made to storage
    saveChangesButton.addEventListener('click', function(){
        setCategories();
    });
    createbookmarksButton.addEventListener('click', function(){
        createBookMarks();
        getBookmarkList();
    });
});


window.onload = function() {
    createBookMarks();
    getCategories(); 
}



function BookMark(){
    this.dateAdded;
    this.id;
    this.index;
    this.parentId;
    this.title;
    this.url;
    this.constructor = function(dateAdded, id, index, parentId, title, link){
        this.dateAdded = dateAdded;
        this.id = id;
        this.index = index;
        this.parentId = parentId;
        this.title = title;
        this.url = link;
    }
}

function CategoryMap(){
    this.id;
    this.parentId;
    this.index;
    this.children;
    this.title;
    this.constructor = function(id, parentId, index, children, title){
        this.id = id;
        this.title = title;
        this.parentId = parentId;
    }
}

// If in a map => open up 
// make bookmark if node has a url
function processNode(node) {
    // recursively process child nodes
    if(node.children != null) {
        node.children.forEach(function(child) { processNode(child); });
    }
    // print leaf nodes URLs to console
    if(node.url) {
         let bookmark = new BookMark();
         bookmark.constructor(node.dateAdded, node.id, node.index, node.parentId, node.title, node.url);
         bookmarksList.push(bookmark);
        //  console.log(bookmarksList);
    }
}

function getBookmarkList(){
    //get the bookmarktree and use a callbackfunction to use the data
    chrome.bookmarks.getTree(function(itemTree){
        //foreach item/node (map or bookmark)
         itemTree.forEach(function(item){
            processNode(item);
         });
         //call orderBookmarks after bookmarks are listed
        orderBookmarks();
    });
}


//HIER GESTOPT 
function orderBookmarks(){

    var sortedObjects = [];
    for(let j=0;j < cats.length;j++){
        sortedObjects[j] = new Array();
    }
    for(let j=0;j < cats.length;j++){
        for(var i = 0; i < bookmarksList.length;i++){  
            console.log(bookmarksList[i].title);
            console.log(cats[j]);
            if(bookmarksList[i].title.includes(cats[j]) || bookmarksList[i].title.toUpperCase().includes(cats[j].toUpperCase()) || bookmarksList[i].title.toLowerCase().includes(cats[j].toLowerCase())){
                sortedObjects[j].push(bookmarksList[i]);
                
            }
            // else{
            //     console.log(bookmarksList[0]);
            //     sortedObjects[cats.length+1][j].push(bookmarksList[i]);
            // } 
        }  
    }
    console.log(sortedObjects);
                return sortedObjects;   
}
function MakeBookmarksMap(){
    var map, childs = [];
    for (var i = 0; i <cats.length; i++) {

        console.log(cats[i]);
        map = new CategoryMap();
        map.constructor(i, i+1, i, childs ,cats[i]);
    }
}



//Create bookmarks
function createBookMarks(){

    //This is a async methode, always execute code after/in this !!
    chrome.storage.local.get('categories', function(result){
        items = result.categories;
        for(var i = 0; i < items.length-1; i++){
            cats.push(items[i]);     
        }
        console.log(cats);
        console.log(cats.length);
        if(cats != null){
            console.log(cats.length);
            // for (var i = 0; i <cats.length; i++) {
            //     console.log(cats[i]);
            //     chrome.bookmarks.create({'parentId': '1', 'index':i,'title': cats[i] }, function(newFolder) {
            //         console.log("added folder: " + newFolder.title);
            //     });
                
            // }      
        }
        getBookmarkList();

    });   
}



























// //--------------------------------Everything to manage the visual ----------------------------------
//Add new Category to the Table 
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

//Performance lose because u create everytime a new btn 
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
