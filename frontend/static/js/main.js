// API 基础URL
const API_BASE_URL = 'http://localhost:8080/api';

// 动画效果
function animateElement(element, delay = 0) {
    gsap.from(element, {
        duration: 0.6,
        opacity: 0,
        y: 20,
        delay: delay,
        ease: 'power2.out'
    });
}

// 显示文章列表
async function showPostList() {
    const postList = document.getElementById('post-list');
    const postEditor = document.getElementById('post-editor');
    const postDetail = document.getElementById('post-detail');

    postList.style.display = 'block';
    postEditor.style.display = 'none';
    postDetail.style.display = 'none';

    animateElement(postList);

    try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        const posts = await response.json();
        
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = '';
        
        posts.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.className = 'post-item';
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</p>
            `;
            animateElement(postElement, index * 0.1);
            postElement.onclick = () => showPostDetail(post);
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        alert('获取文章列表失败：' + error.message);
    }
}

// 显示文章编辑器
function showProjects() {
    document.getElementById('post-list').style.display = 'none';
    document.getElementById('post-editor').style.display = 'none';
    document.getElementById('post-detail').style.display = 'none';
    document.getElementById('projects').style.display = 'block';

    // 添加进入动画
    const projects = document.querySelectorAll('.project-card');
    gsap.from(projects, {
        duration: 0.5,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out'
    });
}

function showEditor() {
    const postList = document.getElementById('post-list');
    const postEditor = document.getElementById('post-editor');
    const postDetail = document.getElementById('post-detail');

    postList.style.display = 'none';
    postEditor.style.display = 'block';
    postDetail.style.display = 'none';

    animateElement(postEditor);
    
    // 清空编辑器
    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';
}

// 显示文章详情
function showPostDetail(post) {
    const postList = document.getElementById('post-list');
    const postEditor = document.getElementById('post-editor');
    const postDetail = document.getElementById('post-detail');

    postList.style.display = 'none';
    postEditor.style.display = 'none';
    postDetail.style.display = 'block';

    animateElement(postDetail);

    document.getElementById('detail-title').textContent = post.title;
    document.getElementById('detail-content').textContent = post.content;
}

// 提交文章
async function submitPost() {
    const title = document.getElementById('post-title').value.trim();
    const content = document.getElementById('post-content').value.trim();

    if (!title || !content) {
        alert('标题和内容不能为空！');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        });

        if (!response.ok) {
            throw new Error('发布失败');
        }

        alert('文章发布成功！');
        showPostList();
    } catch (error) {
        alert('发布文章失败：' + error.message);
    }
}

// 页面加载完成后显示文章列表
document.addEventListener('DOMContentLoaded', showPostList);
