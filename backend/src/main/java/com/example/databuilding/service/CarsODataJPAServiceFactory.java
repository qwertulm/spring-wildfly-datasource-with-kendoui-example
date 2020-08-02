package com.example.databuilding.service;

import org.apache.olingo.odata2.api.processor.ODataContext;
import org.apache.olingo.odata2.jpa.processor.api.ODataJPAContext;
import org.apache.olingo.odata2.jpa.processor.api.ODataJPAServiceFactory;
import org.apache.olingo.odata2.jpa.processor.api.exception.ODataJPARuntimeException;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.servlet.http.HttpServletRequest;

@Component
public class CarsODataJPAServiceFactory extends ODataJPAServiceFactory {

	@Override
    public ODataJPAContext initializeODataJPAContext() throws ODataJPARuntimeException {
        ODataJPAContext ctx = getODataJPAContext();
        ODataContext octx = ctx.getODataContext();
        HttpServletRequest request = (HttpServletRequest) octx.getParameter(ODataContext.HTTP_SERVLET_REQUEST_OBJECT);
        EntityManager em = (EntityManager) request.getAttribute(EntityManagerFilter.EM_REQUEST_ATTRIBUTE);
         
//        ctx.setEntityManager(new EntityManagerWrapper(em));
        ctx.setEntityManager(em);
        ctx.setPersistenceUnitName("default");
        ctx.setContainerManaged(true);                
        return ctx;
    }

}
