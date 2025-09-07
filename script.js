const addNewPageBtn = document.querySelector("#addBtn");
const allFiles = document.querySelector("#allFiles");
const pageNameInput = document.querySelector("#pageNameInput");
const deleteBtn = document.querySelector("#deleteBtn");
const saveBtn = document.querySelector("#saveBtn");
const pageContent = document.querySelector("#content");
const rightPage = document.querySelector("#sectionB");
const emptyState = document.querySelector("#emptyState");

let allPages = [];
let currentPageId = null;

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

    for(let i = 0; i < allFiles.childElementCount; i++) {
        if(allFiles.children[i].getAttribute("data-pageId") === currentPageId) {
            allFiles.children[i].remove();
        }
    }
    pageNameInput.value = "";
    pageContent.value = "";
    if(allPages.length < 1) {
        rightPage.style.display = "none";
        emptyState.style.display = "flex";
    }
}

deleteBtn.addEventListener("click", deletePage);

function savePageContent() {
    if(allFiles.childElementCount < 1) return;

    const content = pageContent.value;
    const pageTitle = pageNameInput.value;
    for(let i = 0; i < allPages.length; i++) {
        if(allPages[i].id === currentPageId) {
            allPages[i].content = content;
            if(pageTitle.trim()) {
                allPages[i].title = pageTitle;
            }
        }
    }

    for(let i = 0; i < allFiles.childElementCount; i++) {
        if(allFiles.children[i].getAttribute("data-pageId") === currentPageId && pageTitle.trim()){
            allFiles.children[i].textContent = pageTitle;
        }
    }
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

function createNewPage() {
    const pageTitle = prompt("Enter page name");
    if(!pageTitle.trim()) {
        return;
    }

    rightPage.style.display = "flex";
    emptyState.style.display = "none";

    const pageId = Date.now() + Math.random().toString(16).slice(2);
    const newPage = document.createElement("div");
    newPage.className = 'newFile';
    newPage.setAttribute("data-pageId", pageId);
    newPage.onclick = () => {
        currentPageId = pageId;
        updateCurrentPageState(page);
    }
    newPage.append(pageTitle);
    allFiles.prepend(newPage);

    pageNameInput.value = pageTitle;

    const page = {
        id: pageId,
        title: pageTitle,
        content: ""
    }
    allPages.push(page);
    updateCurrentPageState(page);
}

addNewPageBtn.addEventListener("click", createNewPage);