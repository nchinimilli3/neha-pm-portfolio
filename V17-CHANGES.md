# V17 changes

- Replaced Scheduler mouse-enter drag handling with pointer-based drag tracking for Safari/Chrome reliability.
- Dragging starts in paint or erase mode based on the first cell touched.
- Starting on an empty/different-status cell paints the selected status across the drag path.
- Starting on a cell already using the selected status erases that status across the drag path.
- Each cell is changed at most once per drag gesture, preventing flicker when the pointer crosses a cell more than once.
- Added touch-action/user-select protections so pointer dragging is not hijacked by browser selection/scroll behavior.
- Preserves right-click note behavior and disables editing in Group Heatmap view.
