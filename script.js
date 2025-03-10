document.addEventListener('DOMContentLoaded', () => {
  fetch('projects.json')
    .then(response => response.json())
    .then(data => {
      const projects = data.projects;

      /* --- Carousel for Featured Projects (index.html) --- */
      const slidesContainer = document.getElementById('slides-container');
      if (slidesContainer) {
        const mainProjects = projects.filter(project => project.main);
        let currentSlide = 0;
        mainProjects.forEach(project => {
          const slide = document.createElement('div');
          slide.classList.add('slide');
          slide.innerHTML = `
            ${project.image ? `<img src="${project.image}" alt="${project.title}">` : `<div class="placeholder">No Image</div>`}
            <h3>${project.title}</h3>
            <p>${project.tech.join(', ')} | ${project.date}</p>
            <div class="links">
              ${project.links.repo ? `<a href="${project.links.repo}" target="_blank">Repo</a>` : ''}
              ${project.links.demo ? `<a href="${project.links.demo}" target="_blank">Demo</a>` : ''}
            </div>
          `;
          slidesContainer.appendChild(slide);
        });
        
        const totalSlides = mainProjects.length;
        document.getElementById('prev').addEventListener('click', () => {
          currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
          updateCarousel();
        });
        document.getElementById('next').addEventListener('click', () => {
          currentSlide = (currentSlide + 1) % totalSlides;
          updateCarousel();
        });
        function updateCarousel() {
          slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        // Auto-slide every 5 seconds
        setInterval(() => {
          currentSlide = (currentSlide + 1) % totalSlides;
          updateCarousel();
        }, 5000);
      }

      /* --- Projects Tiles & Filters for All Projects (projects.html) --- */
      const projectsTilesContainer = document.getElementById('projects-tiles');
      if (projectsTilesContainer) {
        const filterButtonsContainer = document.getElementById('filter-buttons');
        let techSet = new Set();
        projects.forEach(project => {
          if (project.tech && Array.isArray(project.tech)) {
            project.tech.forEach(tech => techSet.add(tech));
          }
        });
        // Create "All" filter button
        const allBtn = document.createElement('button');
        allBtn.classList.add('filter-btn', 'active');
        allBtn.textContent = 'All';
        allBtn.dataset.filter = 'all';
        filterButtonsContainer.appendChild(allBtn);
        // Create buttons for each tech tag
        techSet.forEach(tech => {
          const btn = document.createElement('button');
          btn.classList.add('filter-btn');
          btn.textContent = tech;
          btn.dataset.filter = tech;
          filterButtonsContainer.appendChild(btn);
        });
        
        function renderProjects(filter) {
          projectsTilesContainer.innerHTML = '';
          const filteredProjects = filter === 'all'
            ? projects
            : projects.filter(project => project.tech && project.tech.includes(filter));
          filteredProjects.forEach(project => {
            const tile = document.createElement('div');
            tile.classList.add('project-tile');
            tile.innerHTML = `
              ${project.image ? `<img src="${project.image}" alt="${project.title}">` : `<div class="placeholder">No Image</div>`}
              <h3>${project.title}</h3>
              <p>Tech: ${project.tech ? project.tech.join(', ') : 'N/A'}</p>
              <p>Date: ${project.date}</p>
              <div class="links">
                ${project.links && project.links.repo ? `<a href="${project.links.repo}" target="_blank">Repo</a>` : ''}
                ${project.links && project.links.demo ? `<a href="${project.links.demo}" target="_blank">Demo</a>` : ''}
              </div>
            `;
            projectsTilesContainer.appendChild(tile);
          });
        }
        
        // Initial render with "all" filter
        renderProjects('all');
        
        // Filter button click events
        document.querySelectorAll('.filter-btn').forEach(btn => {
          btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderProjects(this.dataset.filter);
          });
        });
      }
    })
    .catch(err => {
      console.error('Error loading projects:', err);
    });
});
