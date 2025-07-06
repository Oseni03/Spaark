# Portfolio Builder

The Portfolio Builder is an open-source, web-based application designed specifically for developers to create and manage their professional portfolios with ease. Showcase your coding projects, technical skills, and achievements in a sleek and organized manner to attract potential employers, clients, or collaborators.

## Features

- **MagicUI Template**: Start with the [MagicUI free portfolio template](https://magicui.design/docs/templates/portfolio), which is specifically tailored for developers. More templates will be added in future updates.
- **Responsive Design**: Ensures your portfolio looks great on all devices, from desktops to mobile phones.
- **Project Showcase**: Highlight your coding projects with detailed descriptions, tech stacks used, images, and links to live demos or repositories.
- **Skills Section**: Display your technical skills and proficiencies in programming languages, frameworks, and tools.
- **Custom Domain Support**: Use your custom domain to make your portfolio more professional and personalized.
- **Contact Form**: Allow potential clients or employers to reach out to you directly through your portfolio.
- **SEO Optimized**: Built with best practices to ensure your portfolio ranks well in search engines.
- **Easy Deployment**: After filling in the necessary information, users receive a link to their personalized portfolio.
- **Future Template Support**: Plans to provide multiple templates to choose from in future updates.

## Getting Started

1. **Fork the Repository**: Start by forking the repository to your GitHub account.
2. **Clone the Repository**: Clone the forked repository to your local machine.
3. **Install Dependencies**: Navigate to the project directory and run `npm install` to install all required dependencies.
4. **Set up Environment Variables**: Create a `.env.local` file in the root directory with the following variables:
   ```env
   # Sanity CMS Configuration (Optional - for blog functionality)
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2025-01-29
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
   
   # Database Configuration (if using Prisma)
   DATABASE_URL="your_database_url"
   ```
5. **Customize Your Portfolio**: Fill in the necessary information such as personal details, projects, and skills.
6. **Deploy**: Follow the deployment instructions to publish your portfolio online. Once deployed, you will receive a link to your personalized portfolio.

## Environment Variables

### Required for Basic Functionality
- `NEXT_PUBLIC_APP_URL`: The URL of your application (e.g., `http://localhost:3000` for development)
- `NEXT_PUBLIC_ROOT_DOMAIN`: The root domain for portfolio subdomains (e.g., `localhost:3000` for development)
- `DATABASE_URL`: Your database connection string (if using Prisma)

### Optional for Blog Functionality
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your Sanity project ID (get this from your Sanity project settings)
- `NEXT_PUBLIC_SANITY_DATASET`: Your Sanity dataset name (usually `production`)
- `NEXT_PUBLIC_SANITY_API_VERSION`: Sanity API version (default: `2025-01-29`)

**Note**: If Sanity environment variables are not configured, the blog functionality will be disabled, but the portfolio builder will still work normally.

## Contributions

We welcome contributions from the developer community! If you have ideas for new features, bug fixes, or improvements, feel free to open an issue or submit a pull request. Please follow the contribution guidelines outlined in the repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Build your professional developer portfolio today and make a lasting impression with Portfolio Builder!

---

Feel free to customize this description to better fit your specific portfolio builder project for developers.
