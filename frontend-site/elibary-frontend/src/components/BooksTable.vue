<script>
export default {
  name: "BooksTable",
  props: {
    items: { type: Array, default: () => [] },
  },
  emits: ["delete", "edit"],
};
</script>

<template>
  <table class="table table-striped align-middle">
    <thead>
      <tr>
        <th>BookID</th>
        <th>Nimi</th>
        <th>Lehekülgi</th>
        <th>Aasta</th>
        <th>Keel</th>
        <th style="width: 220px;">Tegevused</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="item in items" :key="item.BookID">
        <td class="text-muted" style="font-family: monospace;">{{ item.BookID }}</td>
        <td>{{ item.Name }}</td>
        <td>{{ item.Pages }}</td>
        <td>{{ item.ReleaseYear }}</td>
        <td>{{ item.Language }}</td>

        <td>
          <div class="d-flex gap-2 justify-content-center">
            <button class="btn btn-sm btn-outline-primary" @click="$emit('edit', item)">
              Muuda
            </button>
            <button class="btn btn-sm btn-outline-danger" @click="$emit('delete', item)">
              Kustuta
            </button>
          </div>
        </td>
      </tr>

      <tr v-if="items.length === 0">
        <td colspan="6" class="text-muted">Raamatuid pole (veel).</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped></style>
