import { ConfirmationModal } from "./confirmation";
import CreateArticle from "./create-article";
import CreateTags from "./create-tags";
import CreateKey from "./create-key";
import CreateInvite from "./create-invite";

const Modals = () => {
  return (
    <>
      <CreateArticle />
      <CreateTags />
      <CreateKey />
      <ConfirmationModal />
      <CreateInvite />
    </>
  );
};

export default Modals;
