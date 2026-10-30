# Map endpoint handoff Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Open the matching 3D map from the 2D tool and transfer only measurement endpoints.

**Architecture:** The 2D tool serializes a small versioned fragment after saving its board. The independently packaged 3D viewer validates the payload, calibrates the original board coordinates to scene XZ, resolves actual navigation surfaces, and requests a floor when needed.

**Tech Stack:** Native browser modules, Node test runner, Playwright, Python/NumPy for audited calibration.

---

### Task 1: Coordinate evidence

Create the private viewer's `web/board-calibration.json` and calibration evidence. Export existing 2D landmarks without changing application data; associate independent 3D landmarks and validate held-out points on all nine maps. Reject untrustworthy fits. Store coordinate uncertainty and source-image identity alongside each transform.

### Task 2: 2D handoff

Create `js/core/map-handoff.js` and `tests/unit/map-handoff.test.js`. Test payload validation and route-selection precedence with `node --test tests/unit/map-handoff.test.js` (initially fail, then pass). Modify `index.html`, `css/style.css`, `js/tactic.js`, and `locales/zh-CN.json` to wire the toolbar button, save the board, and navigate within the same tab. Include the unit suite in `package.json`.

### Task 3: 3D reception and package

Create the private viewer's `web/` reception modules, UI styles, build script, preview server, and tests. Package only runtime HTML and integration assets into a generated directory. Validate fragment bounds and image identity, await existing viewer APIs, resolve surfaces with the existing planar controller, and ask for floor selection on overlap. Add a return link without transferring extra board state.

### Task 4: Browser acceptance and delivery

Run unit suites and the existing 2D regression suite. Run real browser transitions for map-only, endpoint transfer, multiple lines, a polyline, missing surface, invalid payload, and ambiguous floors. Verify map names and coordinates using independent landmark evidence rather than transform round-trips alone. Inspect desktop/mobile screenshots. Deliver reviewable commits/PRs and clearly distinguish local acceptance from production rollout.
