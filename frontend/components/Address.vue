<template>
  <v-card class="mx-auto pa-6" max-width="900" outlined>
    <p class="subtitle-1 font-weight-bold">
      Add Your Bitcoin Cash Address Or Create A New One
    </p>
    <v-text-field
      :disabled="disabled"
      class="my-2"
      v-model="address"
      placeholder="bitcoin cash address"
      required
      hint="Please use bitcoin cash test address for example bchtest:qqhnglzjevcarux65dx4s7fa6nwe8nha8gfrscm788"
      persistent-hint
    ></v-text-field>
    <v-text-field
      :disabled="disabled"
      class="my-2"
      v-model="mnemonic"
      placeholder="mnemonic"
      required
    ></v-text-field>
    <v-btn
      color="success"
      class="mr-4"
      @click="addAddress"
      :disabled="disabled"
    >
      Add Address
    </v-btn>
    <v-btn color="blue" class="mr-4 white--text" :disabled="disabled" @click="createNew">
      Create new one
    </v-btn>
    <p class="subtitle-1 font-weight-bold my-3">List Of Your BTCH Address</p>
    <v-card
      class="mx-auto"
      outlined
      v-for="(item, index) in addresses"
      :key="index"
    >
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline mb-1">
            {{ item.address }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions>
        <v-btn
          class="white--text"
          color="blue"
          :disabled="disabled"
          @click="addMainAddress(item.address)"
          v-if="!item.main"
        >
          SET main address
        </v-btn>
        <v-btn
          class="white--text"
          color="red"
          v-if="item.main"
          :disabled="disabled"
          @click="removeMainAddress(item.address)"
        >
          Remove main address
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-card>
</template>
<script lang=ts>
import Cookies from 'js-cookie'
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { configs } from '@/utils/configs.js'
@Component
export default class MyStore extends Vue {
  public address: string = ''
  public mnemonic: string = ''
  public disabled: boolean = true
  public addresses: Array<object> = []
  async mounted() {
    this.disabled = true
    const token = Cookies.get('token')
    const url = configs.url
    try {
      const list_address = this.$axios.get(
        `${url}/list-address${token ? '?token=' + token : ''}`
      )
      const [{ data }] = await Promise.all([list_address])
      this.addresses = data
      this.disabled = false
    } catch (e) {
      this.disabled = false
      console.log(e.message)
    }
  }

  async addAddress() {
    this.disabled = true
    const token = Cookies.get('token')
    const url = configs.url
    const { address, mnemonic } = this
    try {
      const { data } = await this.$axios.post(
        `${url}/add-address${token ? '?token=' + token : ''}`,
        {
          address: address === '' ? undefined : address,
          mnemonic: mnemonic === '' ? undefined : mnemonic,
        }
      )
      this.addresses = data
      this.address = ''
      this.mnemonic = ''
      this.disabled = false
    } catch (e) {
      this.disabled = false
      console.log(e.message)
    }
  }
  async addMainAddress(address) {
    this.disabled = true
    const token = Cookies.get('token')
    const url = configs.url

    try {
      const { data } = await this.$axios.post(
        `${url}/add-main-address${token ? '?token=' + token : ''}`,
        { address }
      )
      this.addresses = data
      this.disabled = false
    } catch (e) {
      this.disabled = false
      console.log(e.message)
    }
  }
  async removeMainAddress(address) {
    this.disabled = true
    const token = Cookies.get('token')
    const url = configs.url

    try {
      const { data } = await this.$axios.post(
        `${url}/remove-main-address${token ? '?token=' + token : ''}`,
        { address }
      )
      this.addresses = data
      this.disabled = false
    } catch (e) {
      this.disabled = false
      console.log(e.message)
    }
  }
  async createNew() {
    this.disabled = true
    const token = Cookies.get('token')
    const url = configs.url

    try {
      const { data } = await this.$axios.post(
        `${url}/create-new${token ? '?token=' + token : ''}`
      )
      this.addresses = data
      this.disabled = false
    } catch (e) {
      this.disabled = false
      console.log(e.message)
    }
  }
}
</script>
