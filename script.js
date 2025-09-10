const addPageBtn = document.querySelector("#addBtn");
const pagesList = document.querySelector("#pagesList");
const pageTitleInput = document.querySelector("#pageTitleInput");
const deleteBtn = document.querySelector("#deleteBtn");
const saveBtn = document.querySelector("#saveBtn");
const pageContentInput = document.querySelector("#content");
const rightPage = document.querySelector("#sectionB");
const emptyStateSection  = document.querySelector("#emptyState");
const toast  = document.querySelector("#toast");
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
    emptyStateSection .style.display = "none";
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

    for(let i = 0; i < pagesList.childElementCount; i++) {
        if(pagesList.children[i].getAttribute("data-pageId") === currentPageId) {
            pagesList.children[i].remove();
        }
    }

    if(allPages.length < 1) {
        rightPage.style.display = "none";
        emptyStateSection .style.display = "flex";
    } else {
        updateCurrentPageState(allPages[allPages.length-1]);
    }
}

deleteBtn.addEventListener("click", deletePage);

function savePageContent() {
    if(pagesList.childElementCount < 1) return;

    const content = pageContentInput.value;
    const pageTitle = pageTitleInput.value;
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

    for(let i = 0; i < pagesList.childElementCount; i++) {
        const node = pagesList.children[i];
        if(node.getAttribute("data-pageId") === currentPageId){
            node.textContent = pageTitle;
        }
    }

    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
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
    pageTitleInput.value = page.title;
    pageContentInput.value = page.content;

    for(let i = 0; i < pagesList.childElementCount; i++) {
        if(pagesList.children[i].getAttribute("data-pageId") === currentPageId) {
            pagesList.children[i].classList.add("selectedPage");
        } else {
            pagesList.children[i].classList.remove("selectedPage");
        }
    }
}

function createAndInsertNode(page) {
    const newPageNode = document.createElement("div");
    newPageNode.className = 'newFile';
    newPageNode.setAttribute("data-pageId", page.id);
    newPageNode.textContent = page.title;
    pagesList.prepend(newPageNode);
}

function createNewPage() {
    const pageTitle = prompt("Enter page name");
    if(!pageTitle.trim()) {
        return;
    }

    rightPage.style.display = "flex";
    emptyStateSection .style.display = "none";

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

addPageBtn.addEventListener("click", createNewPage);

pagesList.addEventListener("click", (e) => {
    const node = e.target;
    if(node.classList.contains("newFile")) {
        const pageId = node.getAttribute("data-pageId");
        const page = allPages.find((p) => {
            return p.id === pageId;
        })
        updateCurrentPageState(page);
    }
})