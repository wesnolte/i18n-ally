import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import Link from "next-translate/Link";

import PluralExample from "../../components/plural-example";
import Header from "../../components/header";
import NoFunctionalComponent from "../../components/no-functional-component";

const Component = props => <p {...props} />;

export default function MoreExamples() {
  const { t } = useTranslation("more-examples");
  const exampleWithVariable = t("example-with-variable", {
    count: 42
  });

  return (
    <>
      <Header />
      <h2>{exampleWithVariable}</h2>
      <PluralExample />
      <p>A hardcoded string</p>
      <p>A second hardcoded string</p>
      <Trans
        i18nKey="example-with-html"
        components={[<Component />, <b style={{ color: "red" }} />]}
      />
      <NoFunctionalComponent />
      <br />
      {t`nested-example.very-nested.nested`}
      <br />
      <Link href="/more-examples/dynamic-namespace">
        <a>{t("dynamic-namespaces-link")}</a>
      </Link>
    </>
  );
}
