/**
 * Layout: data-table
 *
 * Tabla de datos con encabezado (título + descripción + botones), y filas con avatar, nombre/email, compañía, productos apilados (4 imágenes), equipo, fecha y link de acción.
 *
 * Structure-only, pure DS: BEM classes + DS tokens, no utility framework.
 * Staged for publishing in the DS registry (layout/data-table).
 */

export const dataTable = {
  slug: 'data-table',
  name: 'Tabla de datos',
  description:
    'Encabezado con título y botones, tabla con columnas: Nombre (avatar + email), Compañía, Productos (stack de imágenes), Equipo, Fecha y acción "View". 5 filas de ejemplo.',
  components: ['button', 'typography', 'image', 'link-button'],
  html: `<!-- Layout: data-table -->
<!-- Get component CSS: atom_uikit_source("button", ["css"]) -->
<!-- Get tokens: atom_uikit_source("tokens") -->

<section class="l-data-table" id="{{section_id}}">
  <div class="l-data-table__container">
    <!-- Header bar -->
    <div class="l-data-table__header">
      <div class="l-data-table__header-content">
        <h1 class="l-data-table__header-title">{{header_title}}</h1>
        <p class="l-data-table__header-description">{{header_description}}</p>
      </div>
      <div class="l-data-table__header-actions">
        <a href="{{header_cta1_href}}" class="button button--secondary">
          <span class="button__label">{{header_cta1}}</span>
        </a>
        <a href="{{header_cta2_href}}" class="button button--primary">
          <span class="button__label">{{header_cta2}}</span>
        </a>
      </div>
    </div>

    <!-- Table wrapper for overflow -->
    <div class="l-data-table__table-wrapper">
      <table class="l-data-table__table">
        <thead>
          <tr>
            <th class="l-data-table__th l-data-table__th--name">Name</th>
            <th class="l-data-table__th l-data-table__th--company">Company</th>
            <th class="l-data-table__th l-data-table__th--products">Products</th>
            <th class="l-data-table__th l-data-table__th--team">Team</th>
            <th class="l-data-table__th l-data-table__th--date">Date</th>
            <th class="l-data-table__th l-data-table__th--action"></th>
          </tr>
        </thead>
        <tbody>
          <!-- Row 1 -->
          <tr>
            <td class="l-data-table__td l-data-table__td--name">
              <div class="l-data-table__name-cell">
                <img src="{{row1_avatar}}" alt="{{row1_avatar_alt}}" class="l-data-table__avatar" />
                <div class="l-data-table__name-info">
                  <div class="l-data-table__name">{{row1_name}}</div>
                  <a href="mailto:{{row1_email}}" class="l-data-table__email">{{row1_email}}</a>
                </div>
              </div>
            </td>
            <td class="l-data-table__td l-data-table__td--company">{{row1_company}}</td>
            <td class="l-data-table__td l-data-table__td--products">
              <div class="l-data-table__products">
                <img src="{{row1_prod1}}" alt="Product 1" class="l-data-table__product-img" />
                <img src="{{row1_prod2}}" alt="Product 2" class="l-data-table__product-img" />
                <img src="{{row1_prod3}}" alt="Product 3" class="l-data-table__product-img" />
                <img src="{{row1_prod4}}" alt="Product 4" class="l-data-table__product-img" />
              </div>
            </td>
            <td class="l-data-table__td l-data-table__td--team">{{row1_team}}</td>
            <td class="l-data-table__td l-data-table__td--date">{{row1_date}}</td>
            <td class="l-data-table__td l-data-table__td--action">
              <a href="{{row1_link}}" class="link-button">View</a>
            </td>
          </tr>

          <!-- Row 2 -->
          <tr>
            <td class="l-data-table__td l-data-table__td--name">
              <div class="l-data-table__name-cell">
                <img src="{{row2_avatar}}" alt="{{row2_avatar_alt}}" class="l-data-table__avatar" />
                <div class="l-data-table__name-info">
                  <div class="l-data-table__name">{{row2_name}}</div>
                  <a href="mailto:{{row2_email}}" class="l-data-table__email">{{row2_email}}</a>
                </div>
              </div>
            </td>
            <td class="l-data-table__td l-data-table__td--company">{{row2_company}}</td>
            <td class="l-data-table__td l-data-table__td--products">
              <div class="l-data-table__products">
                <img src="{{row2_prod1}}" alt="Product 5" class="l-data-table__product-img" />
                <img src="{{row2_prod2}}" alt="Product 6" class="l-data-table__product-img" />
                <img src="{{row2_prod3}}" alt="Product 7" class="l-data-table__product-img" />
                <img src="{{row2_prod4}}" alt="Product 8" class="l-data-table__product-img" />
              </div>
            </td>
            <td class="l-data-table__td l-data-table__td--team">{{row2_team}}</td>
            <td class="l-data-table__td l-data-table__td--date">{{row2_date}}</td>
            <td class="l-data-table__td l-data-table__td--action">
              <a href="{{row2_link}}" class="link-button">View</a>
            </td>
          </tr>

          <!-- Row 3 -->
          <tr>
            <td class="l-data-table__td l-data-table__td--name">
              <div class="l-data-table__name-cell">
                <img src="{{row3_avatar}}" alt="{{row3_avatar_alt}}" class="l-data-table__avatar" />
                <div class="l-data-table__name-info">
                  <div class="l-data-table__name">{{row3_name}}</div>
                  <a href="mailto:{{row3_email}}" class="l-data-table__email">{{row3_email}}</a>
                </div>
              </div>
            </td>
            <td class="l-data-table__td l-data-table__td--company">{{row3_company}}</td>
            <td class="l-data-table__td l-data-table__td--products">
              <div class="l-data-table__products">
                <img src="{{row3_prod1}}" alt="Product 9" class="l-data-table__product-img" />
                <img src="{{row3_prod2}}" alt="Product 10" class="l-data-table__product-img" />
                <img src="{{row3_prod3}}" alt="Product 11" class="l-data-table__product-img" />
                <img src="{{row3_prod4}}" alt="Product 12" class="l-data-table__product-img" />
              </div>
            </td>
            <td class="l-data-table__td l-data-table__td--team">{{row3_team}}</td>
            <td class="l-data-table__td l-data-table__td--date">{{row3_date}}</td>
            <td class="l-data-table__td l-data-table__td--action">
              <a href="{{row3_link}}" class="link-button">View</a>
            </td>
          </tr>

          <!-- Row 4 -->
          <tr>
            <td class="l-data-table__td l-data-table__td--name">
              <div class="l-data-table__name-cell">
                <img src="{{row4_avatar}}" alt="{{row4_avatar_alt}}" class="l-data-table__avatar" />
                <div class="l-data-table__name-info">
                  <div class="l-data-table__name">{{row4_name}}</div>
                  <a href="mailto:{{row4_email}}" class="l-data-table__email">{{row4_email}}</a>
                </div>
              </div>
            </td>
            <td class="l-data-table__td l-data-table__td--company">{{row4_company}}</td>
            <td class="l-data-table__td l-data-table__td--products">
              <div class="l-data-table__products">
                <img src="{{row4_prod1}}" alt="Product 13" class="l-data-table__product-img" />
                <img src="{{row4_prod2}}" alt="Product 14" class="l-data-table__product-img" />
                <img src="{{row4_prod3}}" alt="Product 15" class="l-data-table__product-img" />
                <img src="{{row4_prod4}}" alt="Product 16" class="l-data-table__product-img" />
              </div>
            </td>
            <td class="l-data-table__td l-data-table__td--team">{{row4_team}}</td>
            <td class="l-data-table__td l-data-table__td--date">{{row4_date}}</td>
            <td class="l-data-table__td l-data-table__td--action">
              <a href="{{row4_link}}" class="link-button">View</a>
            </td>
          </tr>

          <!-- Row 5 -->
          <tr>
            <td class="l-data-table__td l-data-table__td--name">
              <div class="l-data-table__name-cell">
                <img src="{{row5_avatar}}" alt="{{row5_avatar_alt}}" class="l-data-table__avatar" />
                <div class="l-data-table__name-info">
                  <div class="l-data-table__name">{{row5_name}}</div>
                  <a href="mailto:{{row5_email}}" class="l-data-table__email">{{row5_email}}</a>
                </div>
              </div>
            </td>
            <td class="l-data-table__td l-data-table__td--company">{{row5_company}}</td>
            <td class="l-data-table__td l-data-table__td--products">
              <div class="l-data-table__products">
                <img src="{{row5_prod1}}" alt="Product 17" class="l-data-table__product-img" />
                <img src="{{row5_prod2}}" alt="Product 18" class="l-data-table__product-img" />
                <img src="{{row5_prod3}}" alt="Product 19" class="l-data-table__product-img" />
                <img src="{{row5_prod4}}" alt="Product 20" class="l-data-table__product-img" />
              </div>
            </td>
            <td class="l-data-table__td l-data-table__td--team">{{row5_team}}</td>
            <td class="l-data-table__td l-data-table__td--date">{{row5_date}}</td>
            <td class="l-data-table__td l-data-table__td--action">
              <a href="{{row5_link}}" class="link-button">View</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>`,
  css: `/* Layout: data-table — structure only, pure DS tokens */
.l-data-table {
  padding: var(--spacing-20) var(--spacing-8);
}

.l-data-table__container {
  position: relative;
}

.l-data-table__header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-4);
  border: 1px solid var(--border);
  border-bottom: 0;
  padding: var(--spacing-6);
}

@media (min-width: 640px) {
  .l-data-table__header {
    flex-direction: row;
    align-items: center;
  }
}

.l-data-table__header-content {
  /* text content */
}

.l-data-table__header-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-1);
}

@media (min-width: 768px) {
  .l-data-table__header-title {
    font-size: var(--font-size-lg);
  }
}

.l-data-table__header-description {
  font-size: var(--font-size-base);
  color: var(--muted-foreground);
}

.l-data-table__header-actions {
  display: flex;
  gap: var(--spacing-4);
  margin-top: var(--spacing-4);
}

@media (min-width: 640px) {
  .l-data-table__header-actions {
    margin-top: 0;
  }
}

.l-data-table__table-wrapper {
  position: relative;
  width: 100%;
  overflow: auto;
}

.l-data-table__table {
  width: 100%;
  table-layout: fixed;
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
  font-size: var(--font-size-sm);
  caption-side: bottom;
}

.l-data-table__th {
  height: 3rem;
  padding: var(--spacing-4) var(--spacing-6);
  text-align: left;
  vertical-align: middle;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--foreground);
  text-decoration: underline;
  border-bottom: 1px solid var(--border);
}

.l-data-table__th--name {
  width: 350px;
}

@media (min-width: 1440px) {
  .l-data-table__th--name {
    width: 478px;
  }
}

.l-data-table__th--company,
.l-data-table__th--team {
  width: 192px;
}

.l-data-table__th--products {
  width: 192px;
}

.l-data-table__th--date {
  width: 128px;
}

.l-data-table__th--action {
  width: 96px;
  text-align: center;
}

.l-data-table__td {
  height: 5rem;
  padding: var(--spacing-4) var(--spacing-6);
  vertical-align: middle;
  font-size: var(--font-size-base);
  border-bottom: 1px solid var(--border);
}

.l-data-table__td--name {
  font-weight: var(--font-weight-medium);
}

.l-data-table__name-cell {
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  gap: var(--spacing-3);
}

.l-data-table__avatar {
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-full);
  object-fit: cover;
}

.l-data-table__name-info {
  width: 100%;
  max-width: 28rem;
}

.l-data-table__name {
  /* inherits */
}

.l-data-table__email {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  text-decoration: underline;
  color: var(--foreground);
}

.l-data-table__td--company,
.l-data-table__td--team,
.l-data-table__td--date {
  min-width: 8rem;
  max-width: 12rem;
}

.l-data-table__td--date {
  max-width: 6rem;
}

.l-data-table__td--action {
  text-align: center;
  font-weight: var(--font-weight-semibold);
  padding-block: var(--spacing-6);
}

.l-data-table__products {
  position: relative;
  display: flex;
  padding-left: 0.5rem;
}

.l-data-table__product-img {
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  border: 2px solid var(--border);
  object-fit: cover;
  margin-left: -0.5rem;
}

.l-data-table__product-img:first-child {
  margin-left: 0;
}`,
};