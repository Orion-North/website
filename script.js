document.addEventListener('DOMContentLoaded', () => {
    fetch('projects.json')
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById('projects-container');
        data.projects.forEach(project => {
          const projectElem = document.createElement('div');
          projectElem.classList.add('project');
  
          projectElem.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <a href="${project.link}" target="_blank">View Project</a>
          `;
          container.appendChild(projectElem);
        });
      })
      .catch(err => {
        console.error('Error loading projects:', err);
      });
  });
  