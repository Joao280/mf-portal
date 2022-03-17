import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import { RoutesConfig } from "single-spa-layout/dist/types/isomorphic/constructRoutes";

function getTemplate() {
  fetch("http://rare-animals.portal.docker-desktop/template")
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json() as Promise<RoutesConfig>;
    })
    .then((template) => {
      const routes = constructRoutes(template);
      const applications = constructApplications({
        routes,
        loadApp({ name }) {
          return System.import(name);
        },
      });
      const layoutEngine = constructLayoutEngine({ routes, applications });

      applications.forEach(registerApplication);
      layoutEngine.activate();
      start();
    });
}

getTemplate();
