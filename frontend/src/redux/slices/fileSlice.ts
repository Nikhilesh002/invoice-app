import { Bill, UserFile } from '@/types';
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
      const fileIndex = state.files.findIndex(file => file.id === action.payload.fileId);
      if (fileIndex !== -1) {
        const billIndex = state.files[fileIndex].bills.findIndex(bill => bill.id === action.payload.billId);
        if (billIndex !== -1) {
          state.files[fileIndex].bills[billIndex] = action.payload.updatedBill;
        }
      }
    },
    updateInvoiceDetails: (state, action: PayloadAction<{fileId: string, billId: string, invoiceDetails: Invoice}>) => {
      const fileIndex = state.files.findIndex(file => file.id === action.payload.fileId);
      if (fileIndex !== -1) {
        const billIndex = state.files[fileIndex].bills.findIndex(bill => bill.id === action.payload.billId);
        if (billIndex !== -1) {
          state.files[fileIndex].bills[billIndex].invoice = action.payload.invoiceDetails;
        }
      }
    },
    updateProductDetails: (state, action: PayloadAction<{fileId: string, billId: string, productIndex: number, productDetails: Products}>) => {
      const fileIndex = state.files.findIndex(file => file.id === action.payload.fileId);
      if (fileIndex !== -1) {
        const billIndex = state.files[fileIndex].bills.findIndex(bill => bill.id === action.payload.billId);
        if (billIndex !== -1) {
          if (state.files[fileIndex].bills[billIndex].products) {
            state.files[fileIndex].bills[billIndex].products![action.payload.productIndex] = action.payload.productDetails;
          }
        }
      }
    },
    updateCustomerDetails: (state, action: PayloadAction<{fileId: string, billId: string, customerDetails: Customer}>) => {
      const fileIndex = state.files.findIndex(file => file.id === action.payload.fileId);
      if (fileIndex !== -1) {
        const billIndex = state.files[fileIndex].bills.findIndex(bill => bill.id === action.payload.billId);
        if (billIndex !== -1) {
          state.files[fileIndex].bills[billIndex].customer = action.payload.customerDetails;
        }
      }
    }
  }
});

export const { 
  addFile, 
  setCurrentFile, 
  setCurrentBill,
  updateBillInFile,
  updateInvoiceDetails,
  updateProductDetails,
  updateCustomerDetails
} = fileSlice.actions;

export default fileSlice.reducer;