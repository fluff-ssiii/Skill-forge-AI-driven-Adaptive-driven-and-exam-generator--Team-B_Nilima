# ✅ Pre-Share Checklist

Before sharing the project with collaborators, make sure you've completed these steps:

## Your Tasks (Project Owner)

- [ ] Exported database dump file (`springpro_db_dump.sql` exists in project root)
- [ ] Added all setup files to Git:
  ```bash
  git add springpro_db_dump.sql
  git add COLLABORATOR_SETUP_GUIDE.md
  git add QUICK_START.md
  git add DATABASE_SETUP.md
  git commit -m "Add database dump and setup guides for collaborators"
  git push origin main
  ```
- [ ] Verified the repository URL is correct
- [ ] Confirmed all files are pushed to GitHub (check on GitHub website)

## Information to Share with Collaborators

Send them this message:

---

**Subject: Project Setup Instructions - SkillForge**

Hi Team,

I've uploaded the complete project to GitHub. Here's what you need to do:

**Repository URL:** `<YOUR_GITHUB_REPO_URL>`

**Setup Instructions:**
1. For detailed step-by-step guide: See `COLLABORATOR_SETUP_GUIDE.md`
2. For quick setup (if you're experienced): See `QUICK_START.md`

**Important Notes:**
- You'll need MySQL installed and running
- Update your MySQL password in `application.properties` (line 6)
- Don't commit your password to GitHub!
- Each person will have their own local database copy

**What's Included:**
- Complete Spring Boot backend
- React frontend
- Database dump with all current data
- Setup documentation

If you run into any issues, check the troubleshooting section in the setup guide or reach out to me.

Happy coding! 🚀

---

## Optional: Add to .gitignore

To prevent collaborators from accidentally committing their passwords, add this to `.gitignore`:

```
# Local configuration
backend/main/resources/application.properties

# Uploads folder
uploads/
```

**Note:** If you do this, you'll need to share a template version of `application.properties` separately.

## Repository URL

Your GitHub repository URL should be something like:
```
https://github.com/Sahil-Malaiya/SkillForge-_-AI-Driven-Adaptive-Learning-Exam-Generator.git
```

Share this URL with your collaborators!
