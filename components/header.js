class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
    <style>
    :root {
        --mint-green: #c7eae4ff;
        --main-background: #F4FBFA;
        --celadon: #a7e8bdff;
        --eerie-black: #1c2321ff;
        --tropical-indigo: #9395d3ff;
        --yale-blue: #0d3b66ff;
        --fern-green: #A2CE72;
    }

    .logo {
        width: 20px;
    }

    nav {
        background-color: var(--mint-green);
        font-size: large;
    }

    .nav-link {
        color: var(--eerie-black);
    }

    </style>
    <header id="header">
    <nav>
        <ul class="nav nav-pills nav-justified">
            <li class="nav-item">
                <a class="nav-link" id="cellModelLink" href="/cell_model.html"> Cell Model </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="home" href="/">
                    <img src="/images/logo.png" alt="Logo" class="logo"> C3ll Education Learning
                </a>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle"  data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Quiz</a>
                <div class="dropdown-menu">
                    <a class="dropdown-item" href="/quiz_pages/generic.html">General</a>
                </div>
            </li>
            <li class="nav-item">
                <a class="nav-link" target="_blank" id="surveyLink" href="https://forms.office.com/Pages/ResponsePage.aspx?id=B8tSwU5hu0qBivA1z6kadzwmpSt1IGJHv4WPWlMtWNdUMUxaVkdMM1hXMUlFUUxFTVZSMU40MVVOVi4u"> Survey </a>
            </li>
        </ul>
    </nav>
    </header>`;
    }
}

customElements.define('header-component', Header);