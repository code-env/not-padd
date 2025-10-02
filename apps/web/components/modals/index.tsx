import { ConfirmationModal } from "./confirmation";
import CreateArticle from "./create-article";
import CreateTags from "./create-tags";

const Modals = () => {
  return (
    <>
      <CreateArticle />
      <CreateTags />
      <ConfirmationModal />
    </>
  );
};

export default Modals;
