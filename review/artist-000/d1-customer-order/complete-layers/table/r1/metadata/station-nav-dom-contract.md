# Customer-screen station navigation DOM contract

The lower `y=920..1080` strip is not part of the table raster and is not a cooking workspace.
It is the common station-navigation foreground UI defined by `UI-002` and already approved in
Artist 009 R3.

- buttons, text, accessibility labels, active state, and interaction remain DOM/CSS;
- the customer screen has the active `손님` control and adjacent `조립`, `그릴`, `드링크` controls;
- the adjacent controls navigate to `SCR-SVC-ASSEMBLY`, `SCR-SVC-GRILL`, and `SCR-SVC-DRINK`;
- the assembly, grill, and drink workspaces remain their own screens and are not painted into the
  customer-screen foreground;
- `review-table-with-station-nav-fhd-r1.html/png` reuses the approved Artist 009 DOM/CSS crop only
  to demonstrate the occupied lower region while the table raster stays independently reviewable.
