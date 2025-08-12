<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="el-col-6">
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate"
        >
          {{ $t('store.add') }}
        </el-button>
      </div>
      <div class="el-col-18" style="text-align: right">
        <el-input
          v-model="query.name"
          :placeholder="$t('table.keyword')"
          style="width: 150px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="query.city"
          :placeholder="$t('store.city')"
          style="width: 150px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-input
          v-model="query.address"
          :placeholder="$t('store.address')"
          style="width: 150px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-select
          v-model="query.status"
          :placeholder="$t('table.status')"
          clearable
          style="width: 100px"
          class="filter-item"
          @change="handleFilter"
        >
          <el-option
            v-for="st in statusFilter"
            :key="st.value"
            :label="st.name"
            :value="st.value"
          />
        </el-select>
        <el-button
          v-waves
          class="filter-item"
          type="secondary"
          @click="handleReset"
        >
          Reset
        </el-button>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        />
      </div>
    </div>
    <!-- Table -->
    <div class="table-wrapper" style="margin-top: 40px">
      <el-table v-loading="loading" :data="list" fit highlight-current-row style="width: 100%">
        <el-table-column align="center" :label="$t('table.id')" width="80">
          <template slot-scope="scope">
            <span>{{ (query.page - 1) * query.limit + scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('store.name')">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.picture')">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.picture"
              fit="fill"
            />
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.category')">
          <template slot-scope="scope">
            <span>{{ category[scope.row.category_id] }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('store.address')">
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('store.city')">
          <template slot-scope="scope">
            <span>{{ scope.row.city }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('table.status')">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_active"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="doChangeStatus(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="$t('table.actions')"
          width="350"
        >
          <template slot-scope="scope">
            <el-button
              v-permission="['manage store']"
              type="default"
              size="small"
              icon="el-icon-data-analysis"
              @click="handleDetail(scope.row)"
            >
              {{ $t('table.detail') }}
            </el-button>
            <el-button
              v-permission="['manage store']"
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >
              {{ $t('table.edit') }}
            </el-button>
            <el-button
              v-permission="['manage store']"
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="handleDelete(scope.row.id, scope.row.name)"
            >
              {{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :page.sync="query.page"
        :limit.sync="query.limit"
        @pagination="getList"
      />
    </div>
    <!-- CREATE -->
    <el-dialog :title="$t('store.create')" :visible.sync="dialogFormVisible" :custom-class="'rounded-border'">
      <div v-loading="storeCreating" class="form-container">
        <el-form
          ref="storeForm"
          :rules="rules"
          :model="newStore"
          label-position="left"
          label-width="150px"
          style="max-width: 500px"
        >
          <el-form-item :label="$t('store.name')" prop="name">
            <el-input v-model="newStore.name" />
          </el-form-item>
          <el-form-item :label="$t('table.category')" prop="category_id">
            <el-select v-model="newStore.category_id" :placeholder="$t('table.category')" clearable class="filter-item">
              <el-option v-for="ctg of storeFilter" :key="ctg.value" :label="ctg.name" :value="ctg.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.picture')" prop="picture">
            <el-upload
              :class="newStore.picture ? 'thumbnail-showed' : ''"
              action=""
              :on-remove="handleRemove"
              :http-request="handleRequest"
              :file-list="fileList"
              list-type="picture"
              :limit="1"
              :show-file-list="isShowImageThumbnail"
            >
              <el-button size="small" type="primary">{{ $t('table.upload.click') }}</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item :label="$t('store.address')" prop="address">
            <el-input v-model="newStore.address" />
          </el-form-item>
          <el-form-item :label="$t('store.city')" prop="city">
            <el-input v-model="newStore.city" />
          </el-form-item>
          <el-form-item :label="$t('store.zip_code')" prop="zip_code">
            <el-input v-model="newStore.zip_code" />
          </el-form-item>
          <el-form-item :label="$t('table.maps')">
            <label>
              <gmap-autocomplete
                class="el-input__inner"
                :placeholder="$t('table.maps_placeholder')"
                :select-first-on-enter="true"
                @place_changed="setPlace"
              />
            </label>
            <GmapMap
              :center="center"
              :zoom="15"
              map-type-id="terrain"
              :options="{
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: true,
                disableDefaultUi: false,
                disableDoubleClickZoom: true,
              }"
              style="width: 350px; height: 200px; margin-top: 16px"
              @click="mark"
            >
              <GmapMarker
                v-for="(m, index) in markers"
                :key="index"
                :position="m.position"
                :clickable="true"
                :draggable="false"
                @click="center = m.position"
              />
            </GmapMap>
          </el-form-item>
          <el-form-item :label="$t('store.latitude')">
            <el-input v-model="newStore.lat" disabled />
          </el-form-item>
          <el-form-item :label="$t('store.longitude')">
            <el-input v-model="newStore.long" disabled />
          </el-form-item>
          <el-form-item :label="$t('store.radius')">
            <el-input v-model="newStore.radius" />
          </el-form-item>
          <el-form-item :label="$t('store.phone_number')" prop="admin">
            <el-input v-model="newStore.admin" />
          </el-form-item>
          <el-form-item :label="$t('table.status')">
            <el-switch v-model="newStore.is_active" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="createStore()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- UPDATE -->
    <el-dialog :title="$t('store.update')" :visible.sync="dialogUpdateFormVisible" :custom-class="'rounded-border'">
      <div v-loading="storeUpdating" class="form-container">
        <el-form
          ref="updateForm"
          :rules="rules"
          :model="updateStore"
          label-position="left"
          label-width="150px"
          style="max-width: 500px"
        >
          <el-form-item :label="$t('store.name')" prop="name">
            <el-input v-model="updateStore.name" />
          </el-form-item>
          <el-form-item :label="$t('table.category')" prop="category_id">
            <el-select v-model="updateStore.category_id" :placeholder="$t('table.category')" clearable class="filter-item">
              <el-option v-for="ctg of storeFilter" :key="ctg.value" :label="ctg.name" :value="ctg.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.picture')" prop="picture">
            <el-upload
              :class="updateStore.picture ? 'thumbnail-showed' : ''"
              action=""
              :on-remove="handleRemove"
              :http-request="handleRequest"
              :file-list="fileListUpdate"
              list-type="picture"
              :limit="1"
              :show-file-list="isShowImageThumbnail"
            >
              <el-button size="small" type="primary">{{ $t('table.upload.click') }}</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item :label="$t('store.address')" prop="address">
            <el-input v-model="updateStore.address" />
          </el-form-item>
          <el-form-item :label="$t('store.city')" prop="city">
            <el-input v-model="updateStore.city" />
          </el-form-item>
          <el-form-item :label="$t('store.zip_code')" prop="zip_code">
            <el-input v-model="updateStore.zip_code" />
          </el-form-item>
          <el-form-item :label="$t('table.maps')">
            <label>
              <gmap-autocomplete
                class="el-input__inner"
                :placeholder="$t('table.maps_placeholder')"
                :select-first-on-enter="true"
                @place_changed="setPlace"
              />
            </label>
            <GmapMap
              :center="centerUpdate"
              :zoom="15"
              map-type-id="terrain"
              :options="{
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: true,
                disableDefaultUi: false,
                disableDoubleClickZoom: true,
              }"
              style="width: 350px; height: 200px; margin-top: 16px"
              @click="markUpdate"
            >
              <GmapMarker
                v-for="(m, index) in markers"
                :key="index"
                :position="m.position"
                :clickable="true"
                :draggable="false"
                @click="center = m.position"
              />
            </GmapMap>
          </el-form-item>
          <el-form-item :label="$t('store.latitude')">
            <el-input v-model="updateStore.lat" disabled />
          </el-form-item>
          <el-form-item :label="$t('store.longitude')">
            <el-input v-model="updateStore.long" disabled />
          </el-form-item>
          <el-form-item :label="$t('store.radius')">
            <el-input v-model="updateStore.radius" />
          </el-form-item>
          <el-form-item :label="$t('store.phone_number')" prop="admin">
            <el-input v-model="updateStore.admin" />
          </el-form-item>
          <el-form-item :label="$t('table.status')">
            <el-switch v-model="updateStore.is_active" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUpdateFormVisible = false">
            {{ $t('table.cancel') }}
          </el-button>
          <el-button type="primary" @click="doupdateStore()">
            {{ $t('table.confirm') }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- DETAIL -->
    <el-dialog :visible.sync="dialogDetailVisible" :title="$t('store.detail')" :custom-class="'rounded-border'">
      <el-table :data="detailStore" :show-header="false">
        <el-table-column label="Name" width="150">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="Value">
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.name === 'Gambar'"
              style="width: 300px; height: 300px"
              :src="scope.row.value"
              fit="contain"
              lazy
            />
            <GmapMap
              v-if="scope.row.name === 'Peta'"
              :center="{ lat: scope.row.lat, lng: scope.row.long }"
              :zoom="15"
              map-type-id="terrain"
              :options="{
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: true,
                disableDefaultUi: false,
                disableDoubleClickZoom: true,
              }"
              style="width: 350px; height: 200px"
            >
              <GmapMarker
                :position="{ lat: scope.row.lat, lng: scope.row.long }"
                :clickable="true"
                :draggable="false"
                @click="center = m.position"
              />
            </GmapMap>
            <div v-else>
              {{ scope.row.value }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDetailVisible = false">
          {{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'; // Secondary package based on el-pagination
import { fetchListStoreCategory } from '@/api/storeCategory';
import { fetchListStore, createStore, updateStore, deleteStore } from '@/api/store';
import UserResource from '@/api/user';
import waves from '@/directive/waves'; // Waves directive
import permission from '@/directive/permission';
import { fetchUser } from '@/api/report'; // Permission directive
import { uploadImage } from '@/api/uploadImage';
import { isValidImage, isAllowedImageSize, compressImage } from '@/utils/validateImage';
import i18n from '@/lang';

const userResource = new UserResource();

export default {
  name: 'UserList',
  components: { Pagination },
  directives: { waves, permission },
  data() {
    return {
      rawStoreFilter: [
        { id: 1, name: 'Makanan dan Minuman' },
        { id: 2, name: 'Toko Kelontong' },
        { id: 3, name: 'Bahan Makanan Segar' },
        { id: 4, name: 'Makanan Olahan' },
        { id: 5, name: 'Pakaian & Busana' },
        { id: 6, name: 'Peralatan rumah tangga' },
        { id: 7, name: 'Kerajinan Tangan' },
        { id: 8, name: 'Elektronik' },
        { id: 9, name: 'Toko Kesehatan' },
        { id: 10, name: 'Perlengkapan Bayi' },
        { id: 11, name: 'Perlengkapan Sekolah' },
        { id: 12, name: 'Lain - Lain' },
      ],
      storeFilter: [],
      userOptions: [],
      options: [],
      center: { lat: -6.176166, lng: 106.826247 },
      centerUpdate: { lat: -6.176166, lng: 106.826247 },
      currentPlace: null,
      markers: [],
      list: null,
      statusFilter: [
        {
          name: 'Aktif',
          value: 'true',
        },
        {
          name: 'Tidak Aktif',
          value: 'false',
        },
      ],
      category: [],
      total: Infinity,
      loading: true,
      downloading: false,
      storeCreating: false,
      storeUpdating: false,
      query: {
        page: 1,
        limit: 15,
        name: null,
        city: null,
        address: null,
        status: null,
      },
      dummyQuery: {
        page: 1,
        limit: 15,
      },
      dialogFormVisible: false,
      dialogUpdateFormVisible: false,
      dialogPermissionLoading: false,
      dialogDetailVisible: false,
      rules: {
        name: [
          {
            required: true,
            message: i18n.t('error_message.store.name'),
            trigger: 'change',
          },
        ],
        address: [
          {
            required: true,
            message: i18n.t('error_message.store.address'),
            trigger: 'change',
          },
        ],
        city: [
          {
            required: true,
            message: i18n.t('error_message.store.city'),
            trigger: 'change',
          },
        ],
        zip_code: [
          {
            required: true,
            message: 'Kode Pos wajib diisi',
            trigger: 'change',
          },
        ],
        admin: [
          {
            required: true,
            message: i18n.t('error_message.store.phone_number'),
            trigger: 'change',
          },
        ],
      },
      newStore: {},
      updateStore: {},
      detailStore: [],
      place: null,
      description: '',
      fileList: [],
      fileListUpdate: [],
      latLng: {
        lat: '',
        lng: '',
      },
      isShowImageThumbnail: true,
      isSuccessCreatedStore: false,
    };
  },
  created() {
    this.resetnewStore();
    fetchListStoreCategory(this.dummyQuery).then(response => {
      if (response.data) {
        for (const tmp of response.data) {
          this.category[tmp.id] = tmp.name;
          this.storeFilter.push({
            name: tmp.name,
            value: tmp.id,
          });
        }
      }
    });
    this.getList();
  },
  methods: {
    handleRequest(request) {
      const { file } = request;

      if (isValidImage(file)) {
        this.isShowImageThumbnail = true;
        if (isAllowedImageSize(file)) {
          this.handleUploadImage(file);
        } else {
          // need to compress the image here
          compressImage(file).then(response => {
            this.handleUploadImage(response);
          });
        }
      } else {
        this.isShowImageThumbnail = false;
        this.fileList = [];
        this.$message.error(i18n.t('error_message.picture.format'));
      }
    },
    handleUploadImage(file) {
      uploadImage(file).then(response => {
        this.newStore.picture = response.url;
        this.updateStore.picture = response.url;
      })
        .catch(error => {
          console.log(error);
        });
    },
    handleRemove(file, fileList) {
      this.newStore.picture = '';
      this.updateStore.picture = '';
    },
    setDescription(description) {
      this.description = description;
    },
    setPlaceUpdate(place) {
      this.currentPlace = place;
      if (this.currentPlace) {
        this.markers = [
          {
            position: {
              lat: this.place.geometry.location.lat(),
              lng: this.place.geometry.location.lng(),
            },
          },
        ];
        this.currentPlace = null;
        this.updateStore.lat = this.place.geometry.location.lat();
        this.updateStore.long = this.place.geometry.location.lng();
      }
    },
    setPlace(place) {
      if (!place) {
        return;
      }
      this.markers = [
        {
          position: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
        },
      ];
      this.currentPlace = null;
      this.newStore.lat = place.geometry.location.lat();
      this.newStore.long = place.geometry.location.lng();
      this.updateStore.lat = place.geometry.location.lat();
      this.updateStore.long = place.geometry.location.lng();

      this.center = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      this.centerUpdate = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
    },
    usePlace(place) {
      if (this.place) {
        this.markers.push({
          position: {
            lat: this.place.geometry.location.lat(),
            lng: this.place.geometry.location.lng(),
          },
        });
        this.place = null;
      }
    },
    mark(event) {
      this.markers = [
        {
          position: {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          },
        },
      ];
      this.newStore.lat = event.latLng.lat();
      this.newStore.long = event.latLng.lng();
    },
    markUpdate(event) {
      this.markers = [
        {
          position: {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          },
        },
      ];
      this.updateStore.lat = event.latLng.lat();
      this.updateStore.long = event.latLng.lng();
    },
    async getList() {
      this.loading = true;
      this.query.merchant_id = atob(localStorage.getItem('merchant_id'));
      this.query._time = Date.now();
      fetchListStore(this.query).then(response => {
        this.list = response.data;
      })
        .finally(() => {
          if (this.isSuccessCreatedStore) {
            this.assignStorePermission(this.list[0].id);
          }
        });
      fetchUser().then((response) => {
        this.userOptions = response.data;
        this.options = response.data;
      });
      this.loading = false;
    },
    handleReset() {
      this.query = {
        page: 1,
        limit: 15,
        name: null,
        city: null,
        address: null,
        status: null,
        _time: Date.now(),
      };
      this.getList();
    },
    handleFilter() {
      this.query.page = 1;
      this.getList();
    },
    handleCreate() {
      this.resetnewStore();
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['storeForm'].clearValidate();
      });
    },
    handleUpdate(row) {
      this.fileListUpdate = [{ name: 'current_picture.jpg', url: row.picture }];
      this.updateStore = {
        id: row.id,
        name: row.name,
        address: row.address,
        city: row.city,
        picture: row.picture,
        admin: row.admin,
        lat: row.location_lat,
        long: row.location_long,
        radius: row.max_radius,
        is_active: row.is_active,
        zip_code: row.zip_code,
        category_id: row.category_id,
      };
      this.centerUpdate = { lat: row.location_lat, lng: row.location_long };
      this.markers = [
        {
          position: {
            lat: row.location_lat,
            lng: row.location_long,
          },
        },
      ];
      this.dialogUpdateFormVisible = true;
      this.$nextTick(() => {
        this.$refs['updateForm'].clearValidate();
      });
    },
    handleDetail(row) {
      this.detailStore = [
        {
          name: i18n.t('store.name'),
          value: row.name,
        },
        {
          name: i18n.t('table.category'),
          value: this.category[row.category_id],
        },
        {
          name: i18n.t('table.picture'),
          value: row.picture,
        },
        {
          name: i18n.t('store.address'),
          value: row.address,
        },
        {
          name: i18n.t('store.city'),
          value: row.city,
        },
        {
          name: i18n.t('store.zip_code'),
          value: row.zip_code,
        },
        {
          name: i18n.t('store.max_radius'),
          value: row.max_radius,
        },
        {
          name: i18n.t('table.maps'),
          lat: parseFloat(row.location_lat),
          long: parseFloat(row.location_long),
        },
        {
          name: i18n.t('store.latitude'),
          value: row.location_lat,
        },
        {
          name: i18n.t('store.longitude'),
          value: row.location_long,
        },
        {
          name: i18n.t('store.phone_number'),
          value: row.admin,
        },
        {
          name: i18n.t('table.status'),
          value: row.is_active,
        },
      ];
      this.dialogDetailVisible = true;
    },
    handleDelete(id, name) {
      this.$confirm(i18n.t('store.toaster.delete.confirm', { name: name }), 'Peringatan', {
        confirmButtonText: i18n.t('permission.ok'),
        cancelButtonText: i18n.t('permission.cancel'),
        type: 'warning',
      }).then(() => {
        deleteStore(id)
          .then((response) => {
            this.$message({
              message: i18n.t('store.toaster.delete.success', { name: name }),
              type: 'success',
              duration: 5 * 1000,
            });
            this.handleFilter();
            this.revokeStorePermission(id);
          })
          .catch((error) => {
            console.log(error);
            this.$message({
              message: i18n.t('store.toaster.delete.failed'),
              type: 'error',
              duration: 5 * 1000,
            });
          });
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: i18n.t('toaster.delete.cancel'),
          });
        });
    },
    createStore() {
      this.$refs['storeForm'].validate((valid) => {
        if (valid && this.newStore.picture !== '') {
          this.storeCreating = true;
          this.newStore.location_lat = parseFloat(this.newStore.lat);
          this.newStore.location_long = parseFloat(this.newStore.long);
          this.newStore.max_radius = parseFloat(this.newStore.radius);
          this.newStore.lat = null;
          this.newStore.long = null;
          this.newStore.radius = null;
          this.newStore.merchant_id = parseInt(
            atob(localStorage.getItem('merchant_id'))
          );
          createStore(this.newStore)
            .then((response) => {
              if (response.error) {
                this.$message({
                  message: response.message,
                  type: 'error',
                  duration: 5 * 1000,
                });
                return;
              }
              this.$message({
                message: i18n.t('store.toaster.create.success', { name: this.newStore.name }),
                type: 'success',
                duration: 5 * 1000,
              });
              this.isSuccessCreatedStore = true;
              this.resetnewStore();
              this.handleFilter();
            })
            .catch((error) => {
              console.log(error);
              this.$message({
                message: i18n.t('store.toaster.create.failed'),
                type: 'error',
                duration: 5 * 1000,
              });
            })
            .finally(() => {
              this.storeCreating = false;
              this.dialogFormVisible = false;
            });
        } else {
          this.$message.error(i18n.t('error_message.form_not_valid'));
          return false;
        }
      });
    },
    doupdateStore() {
      this.$refs['updateForm'].validate((valid) => {
        if (valid && this.updateStore.picture !== '') {
          this.storeUpdating = true;
          this.updateStore.location_lat = parseFloat(this.updateStore.lat);
          this.updateStore.location_long = parseFloat(this.updateStore.long);
          this.updateStore.max_radius = parseFloat(this.updateStore.radius);
          this.updateStore.lat = null;
          this.updateStore.long = null;
          this.updateStore.radius = null;
          updateStore(this.updateStore)
            .then((response) => {
              if (response.error) {
                this.$message({
                  message: response.message,
                  type: 'error',
                  duration: 5 * 1000,
                });
                return;
              }
              this.$message({
                message: i18n.t('store.toaster.update.success', { name: this.updateStore.name }),
                type: 'success',
                duration: 5 * 1000,
              });
              this.dialogUpdateFormVisible = false;
              this.handleFilter();
            })
            .catch((error) => {
              console.log(error);
              this.$message({
                message: i18n.t('store.toaster.update.failed'),
                type: 'error',
                duration: 5 * 1000,
              });
            })
            .finally(() => {
              this.storeUpdating = false;
              this.dialogUpdateFormVisible = false;
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    doChangeStatus(row) {
      updateStore(row)
        .then((reponse) => {
          this.$message({
            message: i18n.t('store.toaster.update.success', { name: row.name }),
            type: 'success',
            duration: 5 * 1000,
          });
          this.dialogUpdateFormVisible = false;
          this.handleFilter();
        })
        .catch((error) => {
          console.log(error);
          this.$message({
            message: i18n.t('store.toaster.update.failed'),
            type: 'error',
            duration: 5 * 1000,
          });
        });
    },
    resetnewStore() {
      this.fileList = [];
      this.newStore = {
        name: '',
        address: '',
        city: '',
        picture: '',
        lat: 0,
        long: 0,
        radius: 0,
        zip_code: '',
        category_id: null,
      };
      this.markers = [];
      this.center = { lat: -6.176166, lng: 106.826247 };
    },
    async remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.options = this.userOptions.filter((item) => {
          return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
        this.loading = false;
      } else {
        this.options = this.userOptions;
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    assignStorePermission(storeId) {
      userResource
        .assignStorePermission(storeId)
        .then()
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.isSuccessCreatedStore = false;
          location.reload();
        });
    },
    revokeStorePermission(storeId) {
      userResource
        .revokeStorePermission(storeId)
        .then()
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          location.reload();
        });
    },
  },
};
</script>
<style>
.gmap-input-search {
  width: 350px !important;
}
.pac-container {
    background-color: #FFF;
    z-index: 2100 !important;
    position: fixed;
    display: inline-block;
    float: left;
}
.modal{
    z-index: 20;
}
.modal-backdrop{
    z-index: 10;
}
</style>
<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.dialog-footer {
  text-align: left;
  padding-top: 0;
  margin-left: 150px;
}
.app-container {
  flex: 1;
  justify-content: space-between;
  font-size: 14px;
  .block {
    float: left;
    min-width: 250px;
  }
  .clear-left {
    clear: left;
  }
}
</style>
