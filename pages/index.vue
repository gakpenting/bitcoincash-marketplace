<template>
<div>
<buy-shoes />


</div>

</template>

<script lang="ts">
import BuyShoes from '@/components/BuyShoes.vue'
import { Component, Vue } from 'nuxt-property-decorator'
@Component({
  components: {
    BuyShoes,
  },
})
export default class MyStore extends Vue {}
</script>
