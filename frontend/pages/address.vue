<template>
  <v-row justify="center" align="center" 
    >
    <Address />
    </v-row>
</template>
<script lang="ts">
import Cookies from 'js-cookie'
import Address from '@/components/Address.vue'
import { Component, Vue } from 'nuxt-property-decorator'
import axios from 'axios'
@Component({
  components: {
    Address,
  },
})
export default class MyStore extends Vue {

}
</script>

