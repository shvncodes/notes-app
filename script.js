const addNewPageBtn = document.querySelector("#addBtn");
const allFiles = document.querySelector("#allFiles");
const pageNameInput = document.querySelector("#pageNameInput");
const deleteBtn = document.querySelector("#deleteBtn");
const saveBtn = document.querySelector("#saveBtn");
const pageContent = document.querySelector("#content");
const rightPage = document.querySelector("#sectionB");
const emptyState = document.querySelector("#emptyState");
const showToast  = document.querySelector("#toast");
const LOCAL_STORAGE_KEY = "all_pages";

let allPages = [];
let currentPageId = null;

const pagesInLS = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ?? [];

if(pagesInLS.length > 0) {
    allPages = [...pagesInLS];

    for(let i = 0; i < allPages.length; i++) {
        createAndInsertNode(allPages[i]);
    }
    updateCurrentPageState(allPages[allPages.length-1]);
    rightPage.style.display = "flex";
    emptyState.style.display = "none";
}

function saveInLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allPages));
}

function deletePage() {
    if(allPages.length === 0) {
        return;
    }
    const isConfirm = confirm("Are you sure you want to delete this page?");
    if(!isConfirm) {
        return;
    }
    const filterPages = allPages.filter((page)=> {
        if(page.id !== currentPageId) {
            return true;
        }
        return false;
    })

    allPages = [...filterPages];

    saveInLocalStorage();

    for(let i = 0; i < allFiles.childElementCount; i++) {
        if(allFiles.children[i].getAttribute("data-pageId") === currentPageId) {
            allFiles.children[i].remove();
        }
    }

    if(allPages.length < 1) {
        rightPage.style.display = "none";
        emptyState.style.display = "flex";
    } else {
        updateCurrentPageState(allPages[allPages.length-1]);
    }
}

deleteBtn.addEventListener("click", deletePage);

function savePageContent() {
    if(allFiles.childElementCount < 1) return;

    const content = pageContent.value;
    const pageTitle = pageNameInput.value;
    if(!pageTitle.trim()) {
        alert("Please enter page title");
        return;  
    }

    for(let i = 0; i < allPages.length; i++) {
        if(allPages[i].id === currentPageId) {
            allPages[i].content = content;
            allPages[i].title = pageTitle;
        }
    }

    for(let i = 0; i < allFiles.childElementCount; i++) {
        const node = allFiles.children[i];
        if(node.getAttribute("data-pageId") === currentPageId){
            node.textContent = pageTitle;
        }
    }

    showToast.style.display = "block";
    setTimeout(() => {
        showToast.style.display = "none";
    }, 1000);
    
    saveInLocalStorage();
}

saveBtn.addEventListener("click", savePageContent);

function updateCurrentPageState(page) {
    if(!page) {
        console.log("Page is not present!");
        return;
    }
    currentPageId = page.id;
    pageNameInput.value = page.title;
    pageContent.value = page.content;

    for(let i = 0; i < allFiles.childElementCount; i++) {
        if(allFiles.children[i].getAttribute("data-pageId") === currentPageId) {
            allFiles.children[i].classList.add("selectedPage");
        } else {
            allFiles.children[i].classList.remove("selectedPage");
        }
    }
}

function createAndInsertNode(page) {
    const newPageNode = document.createElement("div");
    newPageNode.className = 'newFile';
    newPageNode.setAttribute("data-pageId", page.id);
    newPageNode.addEventListener("click", ()=> {
        updateCurrentPageState(page);
    })
    newPageNode.textContent = page.title;
    allFiles.prepend(newPageNode);
}

function createNewPage() {
    const pageTitle = prompt("Enter page name");
    if(!pageTitle.trim()) {
        return;
    }

    rightPage.style.display = "flex";
    emptyState.style.display = "none";

    const pageId = Date.now() + Math.random().toString(16).slice(2);
    const page = {
        id: pageId,
        title: pageTitle,
        content: ""
    }
    allPages.push(page);
    createAndInsertNode(page);
    updateCurrentPageState(page);
    saveInLocalStorage();
}

addNewPageBtn.addEventListener("click", createNewPage);