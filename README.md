# JMPLS Website

![JMPLS Logo](assets/logo.svg)

Official website for the **John Marshall Pre-Law Society (JMPLS)** at the University of Texas at Dallas — a student organization dedicated to fostering excellence, advocacy, and community for aspiring legal professionals.

## About

This site serves as the digital home for JMPLS, providing members and prospective students with:

- **Membership registration** and dues payment via Stripe
- **Event listings** and campus tour signups
- **Law school tour** registration
- **Beyond the Bar** program information
- **Merchandise** store
- **Member dashboard** with authentication
- **Photo gallery** and organizational resources

## Tech Stack

- **[Vike](https://vike.dev)** — React SSR framework with filesystem routing
- **[React](https://react.dev)** — UI components
- **[Stripe](https://stripe.com)** — Payment processing for memberships, donations, and merchandise
- **[Tailwind CSS](https://tailwindcss.com)** — Styling
- **[Bun](https://bun.sh)** — JavaScript runtime and package manager

## Getting Started

```sh
bun install
bun run dev
```

### Configuration

Site-wide settings (organization info, form URLs, Stripe keys, social links) are managed in [`data/site-config.json`](data/site-config.json).

## Pages

| Route | Description |
| --- | --- |
| `/` | Landing page |
| `/about-us` | Organization info and executive board |
| `/events` | Upcoming and past events |
| `/how-to-join` | Membership information and registration |
| `/law-school-tours` | Law school visit registration |
| `/beyond-the-bar` | Beyond the Bar program |
| `/merchandise` | Store |
| `/gallery` | Photo gallery |
| `/resources` | Pre-law resources |
| `/login` | Member login |
| `/dashboard` | Member dashboard (authenticated) |

## License

© John Marshall Pre-Law Society at UT Dallas. All rights reserved.

