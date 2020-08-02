package com.example.databuilding.locator;

import com.example.databuilding.service.CarsODataJPAServiceFactory;
import org.apache.olingo.odata2.api.ODataServiceFactory;
import org.apache.olingo.odata2.core.rest.ODataRootLocator;

import javax.ws.rs.Path;

@Path("/")
public class CarsRootLocator extends ODataRootLocator {
    
	private CarsODataJPAServiceFactory serviceFactory;
    
	public CarsRootLocator(CarsODataJPAServiceFactory serviceFactory) {
        this.serviceFactory = serviceFactory;
    }
 
    @Override
    public ODataServiceFactory getServiceFactory() {
       return this.serviceFactory;
    } 
}