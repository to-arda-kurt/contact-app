import { useContext } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import ContactItem from "./ContactItem";
import ContactContext from "../../context/contact/contactContext";

const Contacts = () => {
  const contactsContext = useContext(ContactContext);

  const { contacts, filtered } = contactsContext;

  if (contacts.length === 0) {
    return <h3>Please add contact</h3>;
  }

  if (filtered && filtered.length === 0) {
    return (
      <>
        <h3>No Result</h3>
      </>
    );
  }
  return (
    <>
      <TransitionGroup>
        {filtered !== null
          ? filtered.map((contact) => (
              <CSSTransition key={contact.id} timeout={500} classNames="item">
                <ContactItem contact={contact}></ContactItem>
              </CSSTransition>
            ))
          : contacts.map((contact) => (
              <CSSTransition key={contact.id} timeout={500} classNames="item">
                <ContactItem contact={contact}></ContactItem>
              </CSSTransition>
            ))}
      </TransitionGroup>
    </>
  );
};

export default Contacts;
