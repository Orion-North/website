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
            ${project.image ? `<div class="image-container"><img src="${project.image}" alt="${project.title}"></div>` : `<div class="placeholder">No Image</div>`}
            <h3>${project.title}</h3>
            <p>${project.tech.join(', ')} | ${project.date}</p>
            <div class="links">
              ${project.links.repo ? `<a href="${project.links.repo}" target="_blank">Repo</a>` : ''}
              ${project.links.demo ? `<a href="${project.links.demo}" target="_blank">Demo</a>` : ''}
              ${project.capstone ? `<a class="capstone-btn" href="${project.capstoneLink}">View Details</a>` : ''}
            </div>
          `;
          slidesContainer.appendChild(slide);
        });
        
        const totalSlides = mainProjects.length;
        function updateCarousel() {
          slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        
        let autoSlideTimer = setInterval(() => {
          currentSlide = (currentSlide + 1) % totalSlides;
          updateCarousel();
        }, 8000);
        
        function resetTimer() {
          clearInterval(autoSlideTimer);
          autoSlideTimer = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
          }, 8000);
        }
        
        document.getElementById('prev').addEventListener('click', () => {
          currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
          updateCarousel();
          resetTimer();
        });
        document.getElementById('next').addEventListener('click', () => {
          currentSlide = (currentSlide + 1) % totalSlides;
          updateCarousel();
          resetTimer();
        });
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
        const allBtn = document.createElement('button');
        allBtn.classList.add('filter-btn', 'active');
        allBtn.textContent = 'All';
        allBtn.dataset.filter = 'all';
        filterButtonsContainer.appendChild(allBtn);
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
              ${project.image ? `<div class="tile-image-container"><img src="${project.image}" alt="${project.title}"></div>` : `<div class="placeholder">No Image</div>`}
              <h3>${project.title}</h3>
              <p>Tech: ${project.tech ? project.tech.join(', ') : 'N/A'}</p>
              <p>Date: ${project.date}</p>
              <div class="links">
                ${project.links && project.links.repo ? `<a href="${project.links.repo}" target="_blank">Repo</a>` : ''}
                ${project.links && project.links.demo ? `<a href="${project.links.demo}" target="_blank">Demo</a>` : ''}
                ${project.capstone ? `<a class="capstone-btn" href="${project.capstoneLink}">View Details</a>` : ''}
              </div>
            `;
            projectsTilesContainer.appendChild(tile);
          });
        }
        
        renderProjects('all');
        
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

  /* Cursor-following stardust effect */
  document.addEventListener('mousemove', (e) => {
    let particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.style.left = e.pageX + 'px';
    particle.style.top = e.pageY + 'px';
    document.body.appendChild(particle);
    setTimeout(() => {
      particle.remove();
    }, 800);
  });
});
