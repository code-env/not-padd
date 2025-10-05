import { ConfirmationModal } from "./confirmation";
import CreateArticle from "./create-article";
import CreateTags from "./create-tags";
import CreateKey from "./create-key";
const Modals = () => {
  return (
    <>
      <CreateArticle />
      <CreateTags />
      <CreateKey />
      <ConfirmationModal />
    </>
  );
};

export default Modals;
