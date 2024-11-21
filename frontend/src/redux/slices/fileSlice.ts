import { Bill, Customer, Invoice, Products, UserFile } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';



interface FileState {
  files: UserFile[];
  currentFile: UserFile | null;
  currentBill: Bill | null;
}

const initialState: FileState = {
  files: [],
  currentFile: null,
  currentBill: null
};

const fileSlice = createSlice({
  name: 'userfiles',
  initialState,
  reducers: {
    storeFiles: (state, action: PayloadAction<UserFile[]>) => {
      state.files = action.payload;
    },
    deleteFiles:(state,action:PayloadAction<string[]>)=>{
      state.files = state.files.filter(file=>!action.payload.includes(file._id || ''));
    },
    addFile: (state, action: PayloadAction<UserFile>) => {
      state.files.push(action.payload);
    },
    setCurrentFile: (state, action: PayloadAction<UserFile>) => {
      state.currentFile = action.payload;
    },
    setCurrentBill: (state, action: PayloadAction<Bill>) => {
      state.currentBill = action.payload;
    },
    updateBillInFile: (state, action: PayloadAction<{fileId: string, billId: string, updatedBill: Bill}>) => {
      const fileIndex = state.files.findIndex(file => file._id === action.payload.fileId);
      if (fileIndex !== -1) {
        const billIndex = state.files[fileIndex].bills.findIndex(bill => bill._id === action.payload.billId);
        if (billIndex !== -1) {
          state.files[fileIndex].bills[billIndex] = action.payload.updatedBill;
        }
      }
    },
    updateInvoice: (state, action: PayloadAction<{fileId: string, billId: string, invoice: Invoice}>) => {
      const fileIndex = state.files.findIndex(file => file._id === action.payload.fileId);
      if (fileIndex !== -1) {
        const billIndex = state.files[fileIndex].bills.findIndex(bill => bill._id === action.payload.billId);
        if (billIndex !== -1) {
          state.files[fileIndex].bills[billIndex].invoice = action.payload.invoice;
        }
      }
    },
    updateProducts: (state, action: PayloadAction<{fileId: string, billId: string, products: Products[]}>) => {
      const fileIndex = state.files.findIndex(file => file._id === action.payload.fileId);
      if (fileIndex !== -1) {
        const billIndex = state.files[fileIndex].bills.findIndex(bill => bill._id === action.payload.billId);
        if (billIndex !== -1) {
          if (state.files[fileIndex].bills[billIndex].products) {
            state.files[fileIndex].bills[billIndex].products = action.payload.products;
          }
        }
      }
    },
    updateCustomer: (state, action: PayloadAction<{fileId: string, billId: string, customer: Customer}>) => {
      const fileIndex = state.files.findIndex(file => file._id === action.payload.fileId);
      if (fileIndex !== -1) {
        const billIndex = state.files[fileIndex].bills.findIndex(bill => bill._id === action.payload.billId);
        if (billIndex !== -1) {
          state.files[fileIndex].bills[billIndex].customer = action.payload.customer;
        }
      }
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(file => file._id !== action.payload);
      if (state.currentFile && state.currentFile._id === action.payload) {
        state.currentFile = null;
      }
    },
    removeBill: (state, action: PayloadAction<{ fileId: string; billId: string }>) => {
      const file = state.files.find(f => f._id === action.payload.fileId);
      if (file) {
        file.bills = file.bills.filter(bill => bill._id !== action.payload.billId);
      }
      if (state.currentFile && state.currentFile._id === action.payload.fileId) {
        state.currentFile.bills = state.currentFile.bills.filter(bill => bill._id !== action.payload.billId);
      }
      if (state.currentBill && state.currentBill._id === action.payload.billId) {
        state.currentBill = null;
      }
    }
  }
});


export const {
  storeFiles,
  addFile,
  deleteFiles,
  setCurrentFile, 
  setCurrentBill,
  updateBillInFile,
  updateInvoice,
  updateProducts,
  updateCustomer,
  removeFile,
  removeBill
} = fileSlice.actions;

export default fileSlice.reducer;