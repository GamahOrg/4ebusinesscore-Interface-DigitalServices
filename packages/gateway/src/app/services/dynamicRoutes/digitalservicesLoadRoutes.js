export const digitalServicesLoadRoutes = async () => {
  let components = [];
  try {
    let { AppShared } = await import("@4eplatform/shared");
    components.push(AppShared);
  } catch (error) {
    console.error("Error loading shared:", error);
  }
  try {
    let { Connect } = await import("@4eplatform/connect");
    components.push(Connect);
  } catch (error) {
    console.error("Error loading connect :", error);
  }

  try {
    let { DigitalServices } = await import("@4eplatform/digital-services-management");
    components.push(DigitalServices);
  } catch (error) {
    console.error("Error loading digital-services-management:", error);
  }

  return components;
};
