import PocketBase from "pocketbase";

const pb = new PocketBase("https://divine-breeze-8469.fly.dev");

const authService = {
  login: async (email, password) => {
    const records = await pb
      .collection("users")
      .authWithPassword(email, password);
    return records;
  },
  logout: () => {
    pb.authStore.clear();
  },
};

export { pb, authService };