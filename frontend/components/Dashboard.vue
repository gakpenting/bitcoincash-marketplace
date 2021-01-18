<template>
  <v-container>
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold"
        ><a href="/" style="text-decoration: none; color: black">Home</a></v-col
      >
      <v-col cols="4" class="d-flex justify-end"
        ><v-btn @click="logout">LOGOUT</v-btn></v-col
      >
    </v-row>
    <DashboardInfo
      :disabled="disabled"
      :username="username"
      :profilePhoto="profilePhoto"
      :btchToken="btchToken"
      :btchBalance="btchBalance"
      @connect="connectBtch"
      @refresh-balance="refreshBalance"
    />
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold"
        >For Sale Repo List</v-col
      >
    </v-row>
    <DashboardForSale
      :disabled="disabled"
      :ownedRepo="false"
      :amountRefresh="amountRefresh"
      @get-all-repo="getAllRepo"
      :listRepo="forSale"
      :btchToken="btchToken"
      @sell-repo="sellRepo($event.name, $event.amount)"
      @unlist-repo="unlistRepo($event.repo_id)"
    />
    <v-row justify="space-between">
      <v-col cols="4" class="text-h4 font-weight-bold">Owned Repo</v-col>
    </v-row>
    <DashboardOwned
      :disabled="disabled"
      :ownedRepo="true"
      :listRepo="ownedRepo"
    />
    <DashboardRepoAll
      :disabled="disabled"
      @list-repo="listRepo($event.item)"
      @get-all-repo="getAllRepo($event.after_, $event.before_)"
      :pageInfo_="pageInfo_"
      :dialog="dialog"
      :allRepo="allRepo"
    />
    <v-snackbar v-model="snackbarAmount">
      the amount shouldn't be negative or zero
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Cookies from 'js-cookie'
import DashboardInfo from '@/components/dashboard_components/DashboardInfo.vue'
import DashboardForSale from '@/components/dashboard_components/DashboardForSale.vue'
import DashboardOwned from '@/components/dashboard_components/DashboardOwned.vue'
import DashboardRepoAll from '@/components/dashboard_components/DashboardRepoAll.vue'
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { configs } from '@/utils/configs.js'
@Component({
  components: {
    DashboardInfo,
    DashboardForSale,
    DashboardOwned,
    DashboardRepoAll,
  },
})
export default class MyStore extends Vue {
  @Prop({ required: true }) readonly login!: boolean
  public dialog: boolean = false
  public username: string = ''
  public profilePhoto: string = ''
  public snackbarAmount: boolean = false
  public btchToken: boolean = false
  public forSale: Array<object> = []
  public allRepo: Array<object> = []
  public ownedRepo: Array<object> = []
  public btchBalance: number = 0
  public amountRefresh: number = 0
  public disabled: boolean = true
  public pageInfo_: object = {
    hasPreviousPage: false,
    hasNextPage: false,
    startCursor: '',
    endCursor: '',
  }
  logout() {
    Cookies.remove('token')
    window.location.href = '/'
  }
  async mounted() {
    // if (!this.login) window.location.href = '/'
    this.disabled = true
    const token = Cookies.get('token')
    const url = configs.url
    const profile_url = configs.get_profile_url
    const forSaleUrl = configs.get_for_sale_url
    const ownedRepoUrl = configs.get_owned_repo_url
    const _profile = this.$axios.get(`${profile_url}?token=${token}`)
    const _forSale = this.$axios.get(`${forSaleUrl}?token=${token}`)
    const _ownedRepo = this.$axios.get(`${ownedRepoUrl}?token=${token}`)
const _btchMain =this.$axios.get(`${url}/get-main-address?token=${token}`,{headers:{"Cache-Control":"no-cache"}})
    const [profile, forSale, ownedRepo,btchMain ] = await Promise.all([
      _profile,
      _forSale,
      _ownedRepo,
_btchMain
    ])

    if (btchMain.data!==null) {
      this.btchToken = true
      const { data } = await this.$axios.get(
        `${url}/get-balance?token=${token}`
      )
      this.btchBalance = data;
    }else{
this.btchToken = false
    }
    this.username = profile.data.data.login
    this.profilePhoto = profile.data.data.avatarUrl
    this.forSale = forSale.data.data
    this.ownedRepo = ownedRepo.data.data
    this.disabled = false
  }
  async refreshBalance(){
    this.disabled=true
    const url = configs.url
    const token = Cookies.get('token')
    const btchMain = this.$axios.get(`${url}/get-main-address?token=${token}`)
    if (btchMain) {
      this.btchToken = true
      const { data } = await this.$axios.get(
        `${url}/get-balance?token=${token}`
      )
      this.btchBalance = data;
    }
    this.disabled=false
  }
  async getAllRepo(after_: string, before_: string): Promise<void> {
    this.disabled = true
    const token = Cookies.get('token')
    const url = configs.get_all_repo_url

    if (this.allRepo.length === 0) {
      const { data } = await this.$axios.get(`${url}?token=${token}`)
      this.allRepo = data.data.nodes.map(({ ...other }) =>
        this.forSale.filter(({ repo_id }: any) => repo_id === other.id).length >
        0
          ? { added: true, ...other }
          : { ...other }
      )
      console.log(this.allRepo)
      this.pageInfo_ = data.data.pageInfo
    } else if (typeof after_ === 'string' || typeof before_ === 'string') {
      const { data } = await this.$axios.get(
        `${url}?token=${token}${before_ ? `&before=${before_}` : ''}${
          after_ ? `&after=${after_}` : ''
        }`
      )
      this.allRepo = data.data.nodes.map(({ ...other }) =>
        this.forSale.filter(({ repo_id }: any) => repo_id === other.id).length >
        0
          ? { added: true, ...other }
          : { ...other }
      )
      this.pageInfo_ = data.data.pageInfo
    }

    this.dialog = true
    this.disabled = false
  }
  async sellRepo(name: string, amount: number) {
    // console.log(amount)
    this.disabled = true
    if (Number(amount) === 0 || Number(amount) < 0 || !amount) {
      this.snackbarAmount = true
      this.disabled = false
      return
    } else {
      const token = Cookies.get('token')
      const url = configs.url

      const { data } = await this.$axios.post(`${url}/sell-repo-btch?token=${token}`, {
        name,
        amount,
      })
      this.amountRefresh = 0
      this.forSale = data
    }
    this.disabled = false
  }
  async listRepo(item: object): Promise<void> {
    this.disabled = true
    const token = Cookies.get('token')
    const url = configs.list_repo_url
    const { data } = await this.$axios.post(`${url}?token=${token}`, { item })
    this.forSale = data.data
    this.dialog = false
    this.disabled = false
  }
  async unlistRepo(id: string) {
    this.disabled = true
    const token = Cookies.get('token')
    const url = configs.unlist_repo_url
    const { data } = await this.$axios.post(`${url}?token=${token}`, { id })
    this.forSale = data.data
    this.disabled = false
  }
  async connectBtch() {
    if (this.username.trim() !== '') {
      window.location.href = `/address`
    } else {
      alert('please wait until username shown')
    }
  }

  async getforSale() {
    this.disabled = true
    const token = Cookies.get('token')
    const url = configs.get_for_sale_url
    const { data } = await this.$axios.get(`${url}?token=${token}`)
    this.forSale = data.data
    this.disabled = false
  }
}
</script>
