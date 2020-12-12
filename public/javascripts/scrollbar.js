    window.addEventListener('scroll', () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight; //total no of line
        const scrolled = window.scrollY; //specific no of line where we have ,when scoll it increase
        console.log(Math.ceil(scrolled))
        if (Math.ceil(scrolled) > 548) {
            document.getElementById('scTop').style.display = 'inline';
        } else {
            document.getElementById('scTop').style.display = 'none';
        }
    });
