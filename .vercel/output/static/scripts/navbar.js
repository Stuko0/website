window.addEventListener('scroll', function () {
    const nav = document.getElementById('mainNav');
    if (window.scrollY > 400) {
        nav.classList.remove('bg-transparent', 'absolute');
        nav.classList.add('fixed', 'bg-[#663300]');
        nav.style.backdropFilter = 'none';
    } else {
        nav.classList.add('bg-transparent', 'absolute');
        nav.classList.remove('fixed', 'bg-[#663300]');
        nav.style.backdropFilter = 'blur(12px) saturate(150%)';
    }
});