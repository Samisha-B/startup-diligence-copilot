# Startup Diligence Copilot

Developed by Samisha Boywar.

## Problem statement

Investors review fragmented startup documents, assess business claims, investigate risks, compare companies, and research markets before making investment decisions. This project aims to bring these tasks into an evidence-led AI-assisted workspace, while making missing information and uncertainty visible.

## Target workflow

The planned LangGraph workflow coordinates document ingestion, claim extraction, evidence retrieval, claim assessment, investor Q&A, and diligence-summary generation. Startup comparisons and market-size research require comparable data, dated sources, and explicit assumptions.

Claims should be labeled supported, contradicted, or insufficient evidence, with supporting sources and relevant dates. A startup document is not independent verification of its own claims. Missing evidence is not proof of misconduct.

## Implementation status

This repository contains a Next.js/TypeScript application with frontend routes and backend-related dependencies. This update revises the landing page, navigation branding, and project metadata. It does not certify the existing backend or every screen as production-ready.

The target workflow above is project scope, not a completed-feature checklist. LangGraph integration, dataset import, database integration, end-to-end evidence verification, and evaluation remain work to implement or validate. Existing screens may require backend configuration; deploying the landing page does not establish that the entire application works.

## Dataset

Planned starting dataset: [Indian startups by ashishraut64 on Kaggle](https://www.kaggle.com/datasets/ashishraut64/indian-startups-top-300).

Use it for startup discovery, company profiles, and exploratory comparisons. Preserve source metadata and label historical records. It is not a substitute for startup documents, independent verification sources, or market-size evidence. This frontend update does not import the dataset.

## Local development

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open http://localhost:3000. Configure any environment variables required by the routes you use. Do not commit API keys or database credentials.

## Checks

```bash
npm run lint
npm run build
```

Run these in a Node.js environment before treating the application as deployment-ready.

## Deployment plan

The frontend deployment target is Vercel. Review the application's actual environment-variable and database requirements before deploying all routes. Do not expose secrets through NEXT_PUBLIC_ variables. Backend integration and persistent document storage need separate validation.

## Next milestones

1. Validate the frontend build and deploy a preview.
2. Inspect, clean, and import the Kaggle dataset.
3. Connect startup profiles and comparisons to the database.
4. Implement and demonstrate a LangGraph diligence case with cited evidence.
5. Evaluate claim assessments, citation quality, and insufficient-evidence handling.

## Author and attribution

Project developer: Samisha Boywar. Dataset publisher: ashishraut64 on Kaggle. Preserve applicable third-party notices and repository license terms.

This academic prototype supports research; it does not provide investment advice or guarantee a startup's credibility.
