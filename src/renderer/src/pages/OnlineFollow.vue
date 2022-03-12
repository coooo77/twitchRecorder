<template>
  <div class="onlineFollow overflow-y-auto">
    <header m="b-8" display="flex items-center">
      <div class="multiEdit flex items-center mr-3">
        <el-button
          :disabled="!isMultiEdit"
          type="primary"
          @click="handleMultiEdit"
          >EDIT</el-button
        >

        <el-button
          :disabled="!isMultiEdit"
          type="danger"
          @click="handleMultiDelete"
          >DELETE</el-button
        >
      </div>

      <el-input
        :disabled="isProcessing"
        v-model="input"
        placeholder="Enter streamer name to add; you can use semicolon to add multi users, e.g. name1;name2;name3"
        clearable
        @keyup.enter="addUsers"
      >
        <template #append>
          <el-button @click="addUsers" :icon="Plus"></el-button>
        </template>
      </el-input>
    </header>

    <!-- Table Data -->
    <follow-list
      v-if="tableData.length !== 0"
      :tableData="tableData"
      @openDialog="handleOpenDialog"
      @enableMultiEdit="handleMultiEditStatus"
    />

    <el-empty v-else w="full" h="full" description="No Data"></el-empty>
    <!-- <multi-edit-dialog v-model:dialogVisible="multiEditDialogVisible" /> -->

    <edit-dialog
      v-model:dialogVisible="editDialogVisible"
      v-model:dialogData="dialogData"
      @confirmEdit="handleEditData"
      @dialogClose="dialogData = undefined"
    />

    <multi-edit-dialog
      @update:modelValue="multiEditDialogVisible = $event"
      v-model:dialogVisible="multiEditDialogVisible"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElNotification } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import { ITargetUser, ITargetUsers } from "../../../main/types/user";
import MultiEditDialog from "../components/OnlineFollow/MultiEditDialog.vue";
import {
  getUsers,
  GetUsersResponse,
  TwitchGetUsersParams,
} from "../util/twitchAPI_renderer";

const updateList = ref<string[]>([]);

/** Read table data */
const tableData = ref<ITargetUser[]>([]);

/** Add table data */
const isProcessing = ref(false);

const input = ref("");

const editDialogVisible = ref(false);

const multiEditDialogVisible = ref(false);

const dialogData = ref<ITargetUser | undefined>();

const isMultiEdit = ref(false);

const fetchTargets = async () => {
  const recordTargets = (await window.ipcRenderer.invoke(
    "getTargetUsers"
  )) as ITargetUsers;

  tableData.value = Object.values(recordTargets.targets);
};

const fetchUsers = async (): Promise<GetUsersResponse[]> => {
  const usersList = Array.from(new Set(input.value.trim().split(";")));

  if (usersList.length === 0) return [];

  const id: string[] = [];

  const login: string[] = [];

  const isNumber = new RegExp("^[0-9]+$");

  for (let user of usersList) {
    if (isNumber.test(user)) id.push(user);
    else login.push(user);
  }

  const params: TwitchGetUsersParams = { id, login };

  if (id.length === 0) delete params.id;

  if (login.length === 0) delete params.login;

  const response = await getUsers(params);

  return response?.data || [];
};

const addUsers = async () => {
  isProcessing.value = true;

  try {
    const users = await fetchUsers();

    const result = (await window.ipcRenderer.invoke(
      "addTargetUsers",
      users
    )) as boolean;

    input.value = "";

    await fetchTargets();

    ElNotification({
      type: result ? "success" : "error",
      title: result ? "Success" : "Fail",
      message: result ? "Add users successfully" : "Fail to add users",
    });
  } catch (error) {
    console.error(error);

    ElNotification({
      type: "error",
      title: "Fail",
      message: "Error occur.",
    });
  } finally {
    isProcessing.value = false;
  }
};

// Search Data

// Delete data
// const handleDelete = (index: number, row: ITargetUser) => {
//   console.log(index, row)
// }

// Edit Data
const handleOpenDialog = (index: number, row: ITargetUser) => {
  dialogData.value = JSON.parse(JSON.stringify(row));

  editDialogVisible.value = true;
};

const handleMultiEditStatus = (isEnableMultiEdit: boolean) => {
  isMultiEdit.value = isEnableMultiEdit;
};

const handleMultiEdit = () => {
  multiEditDialogVisible.value = true;
};

const handleMultiDelete = () => {
  console.log("handleMultiDelete");
};

/**
 * must send pure js object or get error
 * @see https://github.com/electron/electron/issues/26338
 * */
const handleEditData = async (value: ITargetUser) => {
  try {
    const cloneData = JSON.parse(JSON.stringify(value)) as ITargetUser;

    const result = (await window.ipcRenderer.invoke("editTargetUsers", [
      cloneData,
    ])) as boolean;

    ElNotification({
      type: result ? "success" : "error",
      title: result ? "Success" : "Fail",
      message: result ? "Edit users successfully" : "Fail to edit users",
    });
  } catch (error) {
    console.error(error);

    ElNotification({
      type: "error",
      title: "Fail",
      message: "Error occur.",
    });
  }
};

onMounted(fetchTargets);
</script>

<style>
.onlineFollow {
  font-family: "Poppins", sans-serif;
}
</style>
