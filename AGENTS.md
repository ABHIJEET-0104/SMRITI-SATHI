<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

---

## 📋 Mandatory Coding Guidelines & Protocols

### 1. Maintain `DECISIONS.md`
Record every significant decision made while altering the code, along with the rationale behind those choices (such as why a specific approach, library, or architecture was chosen). Document alternatives considered and impacts on safety, offline resilience, and performance.

### 2. Maintain `FLOW.md`
Document how execution flows across the codebase — including entry points, execution order, function calls, lifecycle hooks, and the exact files and parts modified during the session — to preserve a solid understanding of the codebase structure.

### 3. Self-Quiz Before Accepting Major Changes
After completing a long coding session or proposing major architectural modifications, test understanding by asking the user / reviewing a quiz covering:
- How the modified code integrates with the overall execution flow.
- The rationale behind the implementation choices.
- Potential edge cases (e.g., offline mode, auth state transitions, RLS restrictions).
Only accept pull requests or commit major changes once understanding is verified.
