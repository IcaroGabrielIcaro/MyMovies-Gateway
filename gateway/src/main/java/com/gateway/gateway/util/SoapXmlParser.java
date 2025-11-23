package com.gateway.gateway.util;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

@Component
public class SoapXmlParser {

    public Document parse(String xml) {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(false);

            DocumentBuilder builder = factory.newDocumentBuilder();
            return builder.parse(new InputSource(new StringReader(xml)));

        } catch (Exception e) {
            throw new RuntimeException("Erro ao parsear XML SOAP", e);
        }
    }

    public String getText(Document doc, String tag) {
        NodeList list = doc.getElementsByTagName(tag);
        if (list.getLength() == 0)
            return null;
        return list.item(0).getTextContent();
    }

    public List<Document> getRepeating(Document doc, String tag) {
        List<Document> docs = new ArrayList<>();
        NodeList nodes = doc.getElementsByTagName(tag);

        for (int i = 0; i < nodes.getLength(); i++) {
            try {
                Node node = nodes.item(i);
                DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();

                Document newDoc = builder.newDocument();
                Node imported = newDoc.importNode(node, true);
                newDoc.appendChild(imported);
                docs.add(newDoc);

            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return docs;
    }

    public String getSingle(Document doc, String tagName, String attribute) {
        NodeList list = doc.getElementsByTagName(tagName);
        if (list.getLength() == 0)
            return null;

        Element el = (Element) list.item(0);
        return el.getAttribute(attribute);
    }

    public String getAttribute(Document doc, String attribute) {
        if (doc.getDocumentElement().hasAttribute(attribute)) {
            return doc.getDocumentElement().getAttribute(attribute);
        }
        return null;
    }
}
