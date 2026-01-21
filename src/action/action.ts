"use server";

type State = 
  | { success: true; data: number | string | undefined }
  | { success: false; message: string }


export async function addToCart(prevState : State, queryData: FormData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return {
      success: true,
      cartSize: 12,
    };
  } else {
    return {
      success: false,
      message: "The item is sold out.",
    };
  }
}